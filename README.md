# kyaukyuai.github.io

kyaukyuai (Yuya Kakui) の発信ハブ。note・X・GitHub への入り口。

## 開発

```bash
pnpm install
pnpm run dev      # 開発サーバ
pnpm run build    # 型チェック + 本番ビルド (dist/)
pnpm run preview  # ビルド結果のプレビュー
```

## デプロイ

`main` への push で GitHub Actions（`.github/workflows/deploy.yml`）が build → GitHub Pages へ公開する。
リポジトリ設定で Pages の Source を「GitHub Actions」にする。

## 構成

- Vite 6 + React 19 + TypeScript（strict）+ CSS Modules
- 導線データは `src/data/works.ts`。カードを増やすときはここに追加する。

設計は [yoshiko-pg/yoshiko-pg.github.io](https://github.com/yoshiko-pg/yoshiko-pg.github.io) を参考にした（コードは流用せず自前実装）。
