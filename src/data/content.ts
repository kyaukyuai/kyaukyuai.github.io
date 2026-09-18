// 自動生成: flagship 記事の本文 HTML とスライドデッキ。手で編集しない。
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

export const content: Record<string, ArticleContent> = {}
