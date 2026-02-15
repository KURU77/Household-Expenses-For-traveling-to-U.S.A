# 💰 予算管理アプリ（Budget Tracker PWA）

日本円と米ドルの両通貨で予算を管理できるプログレッシブWebアプリ（PWA）です。

## ✨ 機能

- 📅 **カレンダー機能** - 任意の日付の予算管理が可能
- 💱 **為替レート設定** - 手動で為替レートを設定・更新
- 💴💵 **両通貨対応** - 日本円または米ドルで予算を設定
- 📊 **支出記録** - 米ドルで支出を記録し、両通貨で表示
- 📱 **PWA対応** - ホーム画面に追加してアプリのように使用可能
- 📡 **完全オフライン対応** - インターネット接続不要で動作
- 💾 **データ永続化** - ブラウザのローカルストレージに自動保存

## 🚀 使い方

### オンラインで使用

GitHub Pagesでホストされている場合:
```
https://[あなたのユーザー名].github.io/budget-tracker-pwa/
```

### ローカルで使用

1. このリポジトリをクローン
```bash
git clone https://github.com/[あなたのユーザー名]/budget-tracker-pwa.git
cd budget-tracker-pwa
```

2. HTTPサーバーで起動（Service Workerにはhttpsまたはlocalhostが必要）
```bash
# Pythonがインストールされている場合
python -m http.server 8000

# Node.jsがインストールされている場合
npx serve
```

3. ブラウザで `http://localhost:8000` にアクセス

### PWAとしてインストール

1. 対応ブラウザ（Chrome、Edge、Safari等）でアクセス
2. アドレスバーのインストールアイコンをクリック
3. または画面上部の「インストール」ボタンをクリック
4. ホーム画面に追加されます

## 📱 動作要件

- モダンブラウザ（Chrome、Firefox、Safari、Edge等）
- JavaScriptが有効になっていること
- PWA機能にはHTTPS接続が必要（localhost除く）

## 🎨 アイコンについて

アプリアイコンは以下のサイズで用意してください：

- `icon-192.png` - 192x192ピクセル
- `icon-512.png` - 512x512ピクセル

アイコンを配置したら、`manifest.json`のパスが正しいことを確認してください。

## 🛠️ 技術スタック

- HTML5
- CSS3
- Vanilla JavaScript
- Service Worker API
- LocalStorage API
- PWA (Progressive Web App)

## 📂 ファイル構成

```
budget-tracker-pwa/
├── index.html          # メインHTMLファイル
├── style.css           # スタイルシート
├── app.js              # アプリケーションロジック
├── sw.js               # Service Worker（オフライン対応）
├── manifest.json       # PWAマニフェスト
├── icon-192.png        # アプリアイコン (192x192)
├── icon-512.png        # アプリアイコン (512x512)
└── README.md           # このファイル
```

## 📝 使用方法

1. **日付を選択** - カレンダーで管理したい日を選択
2. **為替レートを設定** - 1 USD = ? JPY のレートを入力
3. **予算を設定** - 日本円または米ドルで予算を入力
4. **支出を記録** - 米ドルで支出を追加
5. **両通貨で確認** - 予算と支出が自動的に両通貨で表示されます

## 🔒 プライバシー

- すべてのデータはブラウザのローカルストレージに保存されます
- サーバーにデータは送信されません
- 完全にオフラインで動作します

## 📄 ライセンス

MIT License

## 🤝 コントリビューション

プルリクエストを歓迎します。大きな変更の場合は、まずissueを開いて変更内容を議論してください。

## 📧 お問い合わせ

質問や提案がある場合は、GitHubのissuesでお知らせください。
