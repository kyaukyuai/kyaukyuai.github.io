// output/articles/*.md から記事一覧データを生成し、flagship 記事は本文を HTML 化して同梱する。
// 使い方: tsx script/generate-articles.ts [articlesDir]
//   articlesDir 省略時は ../kyaukyuai/output/articles（sibling リポジトリ）。
import {
  readdirSync,
  readFileSync,
  writeFileSync,
  copyFileSync,
  mkdirSync,
} from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve, basename } from 'node:path'
import { marked } from 'marked'

const here = dirname(fileURLToPath(import.meta.url))
const articlesDir = resolve(here, '..', process.argv[2] ?? '../kyaukyuai/output/articles')
const imagesDir = resolve(articlesDir, '../images')
const publicImages = resolve(here, '../public/images')

// site 内で本文描画する主要記事（slug = ファイル名から .md を除いたもの）。
const FLAGSHIP = [
  'note-article-53_ai-weekly-w26',
  'he-satya-nadella-frontier-ecosystem',
  'he-eric-siu-single-company-brain',
]

function frontmatter(src: string): Record<string, string> {
  const m = src.match(/^---\n([\s\S]*?)\n---/)
  if (!m) return {}
  const fm: Record<string, string> = {}
  for (const line of m[1].split('\n')) {
    const i = line.indexOf(': ')
    if (i === -1 || line.startsWith(' ') || line.startsWith('-')) continue
    fm[line.slice(0, i).trim()] = line.slice(i + 2).trim()
  }
  return fm
}

function copyImage(ref: string): string {
  // ref 例: output/images/xxx.jpg → public/images/xxx.jpg にコピーし /images/xxx.jpg を返す
  const name = basename(ref)
  try {
    mkdirSync(publicImages, { recursive: true })
    copyFileSync(resolve(imagesDir, name), resolve(publicImages, name))
  } catch {
    console.warn(`  ⚠ 画像コピー失敗: ${ref}`)
  }
  return `/images/${name}`
}

marked.setOptions({ gfm: true, breaks: false })

type Article = {
  slug: string
  title: string
  date: string
  magazine: string
  noteUrl: string
  selfHosted: boolean
}
type Slide = {
  kind: 'title' | 'content'
  title: string
  bullets: string[]
  image?: string
}
type Content = {
  title: string
  date: string
  magazine: string
  noteUrl: string
  hero?: string
  html: string
  deck: Slide[]
}

function stripMd(s: string): string {
  return s
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[*_`>#]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

// 外部リンクは新規タブで開く。
function linkifyHtml(html: string): string {
  return html.replace(
    /<a href=/g,
    '<a target="_blank" rel="noopener noreferrer" href=',
  )
}

// 箇条書き 1 行を、リンク・強調・コードを残したインライン HTML に変換する。
// （画像は要点に不要なので除去。スライドの bullet で使う。）
function inlineHtml(s: string): string {
  const cleaned = s
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\s+/g, ' ')
    .trim()
  if (!cleaned) return ''
  return linkifyHtml((marked.parseInline(cleaned) as string).trim())
}

// 記事本文を「タイトルスライド + ## 章ごとのスライド」に自動変換する。
// 章の要点は、箇条書きがあればそれを、なければ先頭段落の文を使う。
function toDeck(md: string, title: string, meta: string): Slide[] {
  const deck: Slide[] = [{ kind: 'title', title, bullets: [meta] }]
  for (const sec of md.split(/\n(?=## )/)) {
    const head = sec.match(/^## (.+)/)
    if (!head) continue
    const lines = sec.split('\n')
    const image = (sec.match(/!\[[^\]]*\]\(([^)]+)\)/) || [])[1]
    let bullets = lines
      .filter((l) => /^\s*[-*] /.test(l))
      .map((l) => inlineHtml(l.replace(/^\s*[-*] /, '')))
      .filter(Boolean)
    if (bullets.length === 0) {
      // 箇条書きが無い章は、本文の全段落を文単位に分解して要点にする。
      const paras = lines.filter(
        (l) => l.trim() && !/^[#!>-]/.test(l.trim()) && !l.startsWith('!['),
      )
      bullets = paras
        .join(' ')
        .split(/(?<=。)/)
        .map((s) => inlineHtml(s))
        .filter((h) => h.replace(/<[^>]+>/g, '').trim().length > 1)
    }
    // 切り詰めず全文を載せる。要点が多い章は複数スライドに分割（1枚最大4点）。
    const heading = stripMd(head[1])
    const MAX = 4
    if (bullets.length === 0) {
      deck.push({ kind: 'content', title: heading, bullets: [], image })
      continue
    }
    const pages = Math.ceil(bullets.length / MAX)
    for (let p = 0; p < bullets.length; p += MAX) {
      const n = p / MAX + 1
      deck.push({
        kind: 'content',
        title: pages > 1 ? `${heading}（${n}/${pages}）` : heading,
        bullets: bullets.slice(p, p + MAX),
        image: p === 0 ? image : undefined,
      })
    }
  }
  return deck
}

const articles: Article[] = []
const content: Record<string, Content> = {}

for (const file of readdirSync(articlesDir).filter((f) => f.endsWith('.md'))) {
  const slug = file.replace(/\.md$/, '')
  const src = readFileSync(resolve(articlesDir, file), 'utf-8')
  const fm = frontmatter(src)
  if (!fm.note_url || !fm.title) continue
  const selfHosted = FLAGSHIP.includes(slug)
  articles.push({
    slug,
    title: fm.title,
    date: fm.date ?? '',
    magazine: fm.magazine || fm.category || 'その他',
    noteUrl: fm.note_url,
    selfHosted,
  })

  if (selfHosted) {
    let body = src.replace(/^---\n[\s\S]*?\n---\n/, '')
    body = body.replace(/^> \*\*シリーズ\*\*.*\n/m, '') // 内部メタ行を除去
    body = body.replace(/!\[([^\]]*)\]\(output\/images\/([^)]+)\)/g, (_m, alt, p) =>
      `![${alt}](${copyImage('output/images/' + p)})`,
    )
    const hero = fm.hero_image ? copyImage(fm.hero_image) : undefined
    content[slug] = {
      title: fm.title,
      date: fm.date ?? '',
      magazine: fm.magazine || fm.category || 'その他',
      noteUrl: fm.note_url,
      hero,
      html: linkifyHtml(marked.parse(body) as string),
      deck: toDeck(body, fm.title, `${fm.magazine || fm.category || ''}・${fm.date ?? ''}`),
    }
  }
}

articles.sort((a, b) => b.date.localeCompare(a.date))

writeFileSync(
  resolve(here, '../src/data/articles.ts'),
  `// 自動生成: tsx script/generate-articles.ts。手で編集しない。
export type Article = {
  slug: string
  title: string
  date: string
  magazine: string
  noteUrl: string
  selfHosted: boolean
}

export const articles: Article[] = ${JSON.stringify(articles, null, 2)}
`,
)

writeFileSync(
  resolve(here, '../src/data/content.ts'),
  `// 自動生成: flagship 記事の本文 HTML とスライドデッキ。手で編集しない。
export type Slide = {
  kind: 'title' | 'content'
  title: string
  bullets: string[]
  image?: string
}
export type ArticleContent = {
  title: string
  date: string
  magazine: string
  noteUrl: string
  hero?: string
  html: string
  deck: Slide[]
}

export const content: Record<string, ArticleContent> = ${JSON.stringify(content, null, 2)}
`,
)

console.log(`✓ ${articles.length} 記事 / flagship ${Object.keys(content).length} 本を生成`)
