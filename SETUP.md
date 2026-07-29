# SSKS 公開設定

## 問い合わせフォーム

Cloudflare Pages のプロジェクトで、次の環境変数を Production と Preview の両方に登録してください。

- `RESEND_API_KEY`: Resendで発行したAPIキー
- `CONTACT_TO`: `info@ssks.work`
- `CONTACT_FROM`: 例 `SSKS Website <website@send.ssks.work>`

Resend側で `send.ssks.work` などの送信用サブドメインを登録し、表示されたDNSレコードをCloudflare DNSへ追加して認証してください。

Cloudflare Dashboard:
Workers & Pages → 対象プロジェクト → Settings → Variables and Secrets

設定後、GitHubへPUSHして再デプロイします。

## 公開後

1. `https://ssks.work/sitemap.xml` を開いて確認
2. Google Search Consoleでドメインプロパティを追加
3. サイトマップ `https://ssks.work/sitemap.xml` を送信
4. Bing Webmaster Toolsへ登録（Search Consoleからインポート可）
5. GA4を作成する場合は測定IDを取得し、Googleタグをhead内へ追加
6. フォームを実際に送信し、info@ssks.workへの到着と返信先を確認


## 実績データの自動生成
公開前に `npm run build` を実行してください。Cloudflare Pagesでは Build command に同じコマンドを設定します。
