# 実績ページの更新方法（HTMLだけで運用）

## 新しい実績を追加する

1. `works/work-template.html` をコピーします。
2. 例：`works/kotty-ec-support.html` のような英数字ファイル名に変更します。
3. HTML上部の `WORK DATA` 内にある `<meta>` の `content` を編集します。
4. 本文、画像、タイトルを通常のHTMLとして編集します。
5. 公開・デプロイ時に `npm run build` を実行します。

これで `assets/data/works.json` が自動生成され、トップページとWORK一覧へ反映されます。
`works.json` を直接編集する必要はありません。

## Cloudflare Pagesの設定（初回だけ）

- Build command：`npm run build`
- Build output directory：サイトの現在の公開ディレクトリ（通常は `/` または未指定）

GitHub連携では、以後HTMLを追加してpushするだけで自動生成されます。

## WORK DATAの意味

- `work:title`：実績名
- `work:category`：`web` / `ec` / `ai`
- `work:category-label`：一覧に表示する英字ラベル
- `work:year`：年
- `work:summary`：一覧用説明文
- `work:image`：一覧画像。詳細ページが `works/` 内なので `../assets/img/works/画像名.webp` と記載
- `work:featured`：`true` でトップにも表示
- `work:published`：`false` でトップ・一覧から非表示
- `work:order`：数字が大きいほど先に表示

## 画像

一覧画像はCSSで `object-fit: cover` されます。推奨は **1600×1000px（16:10）** です。
異なる比率でも表示できますが、上下または左右が自動的にトリミングされます。
詳細ページのメイン画像は **1600×800px（2:1）**、ギャラリー画像は **1600×1200px（4:3）** が推奨です。
