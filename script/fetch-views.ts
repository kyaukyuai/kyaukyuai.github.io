// ビルド時に Umami Cloud API から記事ごとの累計ページビューを取得し src/data/views.ts に書き出す。
// 使い方: UMAMI_API_KEY=xxx tsx script/fetch-views.ts
//   UMAMI_API_KEY が無い環境（ローカル等）では何もしない（views.ts は既存の値のまま）。
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const out = resolve(here, '../src/data/views.ts')

// website-id は公開値（計測スクリプトに出る）。API キーのみ秘密。
const WEBSITE_ID = '67b93f7a-4f1d-458e-9f7c-e3a69dbc6f64'
const KEY = process.env.UMAMI_API_KEY

function emit(views: Record<string, number>) {
  writeFileSync(
    out,
    `// 自動生成: tsx script/fetch-views.ts（Umami 累計PV）。手で編集しない。
export const views: Record<string, number> = ${JSON.stringify(views, null, 2)}
`,
  )
}

if (!KEY) {
  console.log('ℹ UMAMI_API_KEY 未設定。ビュー数取得をスキップ（views.ts は据え置き）。')
  process.exit(0)
}

// サイト公開（2026-06）以降を集計対象に。
const startAt = Date.parse('2026-06-01T00:00:00Z')
const endAt = Date.now()
const url = `https://api.umami.is/v1/websites/${WEBSITE_ID}/metrics?type=url&startAt=${startAt}&endAt=${endAt}`

try {
  const res = await fetch(url, {
    headers: { 'x-umami-api-key': KEY, accept: 'application/json' },
  })
  if (!res.ok) throw new Error(`HTTP ${res.status} ${await res.text().catch(() => '')}`)
  const rows = (await res.json()) as { x: string; y: number }[]
  // /articles/<slug> のパスを slug に正規化して累計（末尾スラッシュ有無を吸収）。
  const views: Record<string, number> = {}
  for (const { x, y } of rows) {
    const m = x.match(/^\/articles\/([^/?#]+)\/?$/)
    if (m) views[m[1]] = (views[m[1]] ?? 0) + (y || 0)
  }
  emit(views)
  console.log(`✓ ${Object.keys(views).length} 記事のビュー数を取得`)
} catch (e) {
  // 取得失敗時はビルドを止めず、空で続行（カウントは非表示になるだけ）。
  console.warn(`⚠ ビュー数取得失敗: ${(e as Error).message}。空で続行。`)
  emit({})
}
