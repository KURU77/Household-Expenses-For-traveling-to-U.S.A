// Service Worker登録（オフライン対応）
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js').then(() => {
            console.log('Service Worker registered - App works offline!');
        }).catch((error) => {
            console.log('Service Worker registration failed:', error);
        });
    });
}

let selectedCurrency = 'JPY';
let selectedExpenseCurrency = 'USD'; // 支出入力用の通貨
let selectedDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD形式
let allData = {}; // 全ての日付のデータを保存

// ページ読み込み時にデータを復元
window.onload = function() {
    // 今日の日付をデフォルトで設定
    document.getElementById('dateSelector').value = selectedDate;
    loadAllData();
    updateDateDisplay();
    loadCurrentDateData();
    updateDisplay();
    
    // オフライン検出
    updateOnlineStatus();
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    
    // インストールプロンプト
    setupInstallPrompt();
};

function updateOnlineStatus() {
    const indicator = document.getElementById('offlineIndicator');
    if (!navigator.onLine) {
        indicator.classList.add('offline');
    } else {
        indicator.classList.remove('offline');
    }
}

let deferredPrompt;

function setupInstallPrompt() {
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        document.getElementById('installPrompt').style.display = 'flex';
    });

    document.getElementById('installBtn').addEventListener('click', async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            console.log(`User response: ${outcome}`);
            deferredPrompt = null;
            document.getElementById('installPrompt').style.display = 'none';
        }
    });

    window.addEventListener('appinstalled', () => {
        console.log('PWA installed successfully');
        document.getElementById('installPrompt').style.display = 'none';
    });
}

function closeInstallPrompt() {
    document.getElementById('installPrompt').style.display = 'none';
}

function loadAllData() {
    const saved = localStorage.getItem('budgetDataAll');
    if (saved) {
        allData = JSON.parse(saved);
    }
}

function saveAllData() {
    localStorage.setItem('budgetDataAll', JSON.stringify(allData));
}

function changeDate() {
    const newDate = document.getElementById('dateSelector').value;
    if (newDate) {
        selectedDate = newDate;
        updateDateDisplay();
        loadCurrentDateData();
        updateDisplay();
    }
}

function updateDateDisplay() {
    const dateObj = new Date(selectedDate + 'T00:00:00');
    const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
    const formattedDate = dateObj.toLocaleDateString('ja-JP', options);
    document.getElementById('selectedDateDisplay').textContent = formattedDate;
}

function loadCurrentDateData() {
    if (allData[selectedDate]) {
        const data = allData[selectedDate];
        document.getElementById('exchangeRate').value = data.exchangeRate || '';
        
        if (data.exchangeRate > 0) {
            document.getElementById('rateDisplay').style.display = 'block';
            document.getElementById('rateDisplay').textContent = `現在のレート: 1 USD = ${data.exchangeRate.toFixed(2)} JPY`;
        } else {
            document.getElementById('rateDisplay').style.display = 'none';
        }
    } else {
        // この日付のデータがない場合は空にする
        document.getElementById('exchangeRate').value = '';
        document.getElementById('rateDisplay').style.display = 'none';
        document.getElementById('budgetAmount').value = '';
    }
}

function getCurrentDateData() {
    if (!allData[selectedDate]) {
        allData[selectedDate] = {
            exchangeRate: 0,
            dailyBudgetJPY: 0,
            dailyBudgetUSD: 0,
            expenses: []
        };
    }
    return allData[selectedDate];
}

function saveCurrentDateData() {
    saveAllData();
}

function selectCurrency(currency) {
    selectedCurrency = currency;
    document.getElementById('jpyBtn').classList.toggle('active', currency === 'JPY');
    document.getElementById('usdBtn').classList.toggle('active', currency === 'USD');
    document.getElementById('budgetLabel').textContent = `予算金額 (${currency})`;
}

function selectExpenseCurrency(currency) {
    selectedExpenseCurrency = currency;
    document.getElementById('expenseJpyBtn').classList.toggle('active', currency === 'JPY');
    document.getElementById('expenseUsdBtn').classList.toggle('active', currency === 'USD');
    document.getElementById('expenseAmountLabel').textContent = `金額 (${currency})`;
}

function saveRate() {
    const rate = parseFloat(document.getElementById('exchangeRate').value);
    if (isNaN(rate) || rate <= 0) {
        alert('有効な為替レートを入力してください');
        return;
    }
    
    const data = getCurrentDateData();
    data.exchangeRate = rate;
    
    document.getElementById('rateDisplay').style.display = 'block';
    document.getElementById('rateDisplay').textContent = `現在のレート: 1 USD = ${rate.toFixed(2)} JPY`;
    saveCurrentDateData();
    updateDisplay();
    alert('為替レートを保存しました');
}

function saveBudget() {
    const data = getCurrentDateData();
    
    if (data.exchangeRate <= 0) {
        alert('先に為替レートを設定してください');
        return;
    }

    const amount = parseFloat(document.getElementById('budgetAmount').value);
    if (isNaN(amount) || amount <= 0) {
        alert('有効な予算金額を入力してください');
        return;
    }

    if (selectedCurrency === 'JPY') {
        data.dailyBudgetJPY = amount;
        data.dailyBudgetUSD = amount / data.exchangeRate;
    } else {
        data.dailyBudgetUSD = amount;
        data.dailyBudgetJPY = amount * data.exchangeRate;
    }

    saveCurrentDateData();
    updateDisplay();
    document.getElementById('budgetDisplaySection').style.display = 'block';
    alert('予算を設定しました');
}

function addExpense() {
    const data = getCurrentDateData();
    
    if (data.exchangeRate <= 0) {
        alert('先に為替レートを設定してください');
        return;
    }

    const amount = parseFloat(document.getElementById('expenseAmount').value);
    const description = document.getElementById('expenseDescription').value.trim();

    if (isNaN(amount) || amount <= 0) {
        alert('有効な金額を入力してください');
        return;
    }

    if (!description) {
        alert('支出の内容を入力してください');
        return;
    }

    // 入力通貨に応じてUSDに変換
    let amountUSD;
    if (selectedExpenseCurrency === 'JPY') {
        amountUSD = amount / data.exchangeRate;
    } else {
        amountUSD = amount;
    }

    data.expenses.push({
        amount: amountUSD, // 内部的には常にUSDで保存
        description: description,
        timestamp: new Date().toLocaleString('ja-JP')
    });

    document.getElementById('expenseAmount').value = '';
    document.getElementById('expenseDescription').value = '';

    saveCurrentDateData();
    updateDisplay();
}

function deleteExpense(index) {
    if (confirm('この支出を削除しますか?')) {
        const data = getCurrentDateData();
        data.expenses.splice(index, 1);
        saveCurrentDateData();
        updateDisplay();
    }
}

function updateDisplay() {
    const data = getCurrentDateData();
    
    // 予算表示
    if (data.dailyBudgetJPY > 0) {
        document.getElementById('budgetJPY').textContent = `¥${data.dailyBudgetJPY.toLocaleString('ja-JP', {maximumFractionDigits: 0})}`;
        document.getElementById('budgetUSD').textContent = `$${data.dailyBudgetUSD.toFixed(2)}`;
        document.getElementById('budgetDisplaySection').style.display = 'block';
    } else {
        document.getElementById('budgetDisplaySection').style.display = 'none';
    }

    // 支出合計
    const totalExpenseUSD = data.expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const totalExpenseJPY = totalExpenseUSD * (data.exchangeRate || 0);

    // 残り予算
    const remainingUSD = data.dailyBudgetUSD - totalExpenseUSD;
    const remainingJPY = data.dailyBudgetJPY - totalExpenseJPY;

    if (data.dailyBudgetJPY > 0) {
        document.getElementById('remainingAmount').textContent = 
            `¥${remainingJPY.toLocaleString('ja-JP', {maximumFractionDigits: 0})} / $${remainingUSD.toFixed(2)}`;
    }

    // 支出リスト
    const expenseList = document.getElementById('expenseList');
    if (data.expenses.length === 0) {
        expenseList.innerHTML = '<div class="empty-state">まだ支出がありません</div>';
    } else {
        expenseList.innerHTML = data.expenses.map((exp, index) => {
            const amountJPY = exp.amount * (data.exchangeRate || 0);
            return `
            <div class="expense-item">
                <div class="expense-description">${exp.description}</div>
                <div class="expense-amount">
                    <div class="expense-amount-primary">$${exp.amount.toFixed(2)}</div>
                    <div class="expense-amount-secondary">¥${amountJPY.toLocaleString('ja-JP', {maximumFractionDigits: 0})}</div>
                </div>
                <button class="delete-btn" onclick="deleteExpense(${index})">削除</button>
            </div>
        `;
        }).join('');
    }
}
