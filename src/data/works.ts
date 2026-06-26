export type Work = {
  title: string
  description: string
  url: string
  category: 'magazine' | 'sns' | 'code'
}

// 成果物ハブ。新しい導線はここに追加する。
export const works: Work[] = [
  {
    title: 'Harness Engineering',
    description: 'AI エージェントの設計と運用を追うマガジン',
    url: 'https://note.com/_kihonushi/m/mded0f5bc8852',
    category: 'magazine',
  },
  {
    title: 'note（全記事）',
    description: 'AI週報・記事をすべて公開している',
    url: 'https://note.com/_kihonushi',
    category: 'magazine',
  },
  {
    title: 'X',
    description: '@kihonushi — 日々の発信',
    url: 'https://x.com/kihonushi',
    category: 'sns',
  },
  {
    title: 'GitHub',
    description: '@kyaukyuai — コードと実験',
    url: 'https://github.com/kyaukyuai',
    category: 'code',
  },
]
