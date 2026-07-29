# 実績の更新方法

実績データは `assets/data/works.json` のみで管理します。

## 反映先

- `index.html`：`featured: true` の公開実績を先頭から3件表示
- `works.html`：`published: false` 以外をすべて表示

## 追加手順

1. `work-detail-template.html` を複製し、実績詳細ページを作成します。
2. `assets/data/works.json` の配列先頭に新しい実績を追加します。
3. 画像を使う場合は `assets/img/` に配置し、`image` にパスを入力します。
4. トップにも表示する場合は `featured` を `true` にします。
5. 一時的に非公開にする場合は `published` を `false` にします。

## データ例

```json
{
  "id": "project-name",
  "title": "実績タイトル",
  "category": "web",
  "categoryLabel": "WEB DESIGN",
  "year": "2026",
  "summary": "担当範囲や成果の要約",
  "url": "./work-project-name.html",
  "image": "./assets/img/work-project-name.webp",
  "imageAlt": "実績の画面イメージ",
  "featured": true,
  "published": true
}
```

カテゴリーは `web`、`ec`、`ai` を使用すると、一覧ページの絞り込みに対応します。

## 注意

`works.json` はブラウザの `fetch()` で読み込むため、HTMLファイルを直接ダブルクリックした `file://` 表示では読み込めない場合があります。Cloudflare Pagesなどの公開環境、またはローカルサーバーで確認してください。
