# 実績ページの更新方法

## 普段の更新は「HTMLを1ファイル追加 → GitHubへPush」だけ

`works.json` と `sitemap.xml` は直接編集しません。
Cloudflare Pages のビルド時に `npm run build` が実行され、`works/` 内のHTMLから両方が自動生成されます。

### 初回だけCloudflare Pagesで確認する設定

- Build command: `npm run build`
- Build output directory: `/`（現在のプロジェクト構成に合わせてルートを公開）

この設定後は、実績HTMLを追加してGitHubへPushするだけです。

## 新しい実績を追加する

1. `works/work-template.html` をコピー
2. `works/work-xxxx.html` のような英数字ファイル名に変更
3. HTML上部の `WORK DATA` を編集
4. 本文と画像を編集
5. GitHubへPush

### WORK DATA

- `work:title`：実績名
- `work:category`：`web` / `ec` / `ai` / `graphic` など
- `work:category-label`：一覧に表示する英字ラベル
- `work:year`：年
- `work:summary`：一覧用説明
- `work:image`：一覧画像（例 `../assets/img/works/example.webp`）
- `work:featured`：`true` ならTOPにも表示
- `work:published`：`false` ならTOP・一覧・サイトマップから非表示
- `work:order`：数字が大きいほど先に表示

## 画像

一覧画像は `object-fit: cover` で自動調整されます。
推奨は1600×1000px前後です。異なる比率でも表示できますが、表示枠に合わせてトリミングされます。
