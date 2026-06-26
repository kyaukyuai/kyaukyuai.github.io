import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import styles from './Article.module.css'
import { content } from '../data/content'
import { Presentation } from '../components/Presentation'

export function Article() {
  const { slug = '' } = useParams()
  const a = content[slug]
  const [slideMode, setSlideMode] = useState(false)

  if (!a) {
    return (
      <main className={styles.main}>
        <Link to="/articles" className={styles.back}>
          ← 記事
        </Link>
        <p>記事が見つかりませんでした。</p>
      </main>
    )
  }

  return (
    <main className={styles.main}>
      <div className={styles.topbar}>
        <Link to="/articles" className={styles.back}>
          ← 記事
        </Link>
        <button className={styles.slideButton} onClick={() => setSlideMode(true)}>
          ▸ スライドで見る
        </button>
      </div>

      <article className={styles.article}>
        {a.hero && <img className={styles.hero} src={a.hero} alt="" />}
        <div className={styles.meta}>
          <time>{a.date}</time>
          <span className={styles.mag}>{a.magazine}</span>
        </div>
        <div
          className={styles.prose}
          dangerouslySetInnerHTML={{ __html: a.html }}
        />
        <p className={styles.noteLink}>
          <a href={a.noteUrl} target="_blank" rel="noopener noreferrer">
            note で読む →
          </a>
        </p>
      </article>

      {slideMode && (
        <Presentation deck={a.deck} onClose={() => setSlideMode(false)} />
      )}
    </main>
  )
}
