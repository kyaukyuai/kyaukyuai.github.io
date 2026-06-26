import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import styles from './Articles.module.css'
import { articles } from '../data/articles'

const ALL = 'すべて'

export function Articles() {
  const magazines = useMemo(() => {
    const counts = new Map<string, number>()
    for (const a of articles) counts.set(a.magazine, (counts.get(a.magazine) ?? 0) + 1)
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([m]) => m)
  }, [])

  const [active, setActive] = useState(ALL)
  const list = active === ALL ? articles : articles.filter((a) => a.magazine === active)

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <Link to="/" className={styles.back}>
          ← kyaukyuai
        </Link>
        <h1 className={styles.title}>記事</h1>
        <p className={styles.lead}>note に公開した {articles.length} 本。</p>
      </header>

      <nav className={styles.filters}>
        {[ALL, ...magazines].map((m) => (
          <button
            key={m}
            className={`${styles.filter} ${active === m ? styles.filterActive : ''}`}
            onClick={() => setActive(m)}
          >
            {m}
          </button>
        ))}
      </nav>

      <ul className={styles.list}>
        {list.map((a) => {
          const meta = (
            <>
              <span className={styles.meta}>
                <time>{a.date}</time>
                <span className={styles.mag}>{a.magazine}</span>
                {a.selfHosted && <span className={styles.badge}>サイト内</span>}
              </span>
              <span className={styles.itemTitle}>{a.title}</span>
            </>
          )
          return (
            <li key={a.slug}>
              {a.selfHosted ? (
                <Link className={styles.item} to={`/articles/${a.slug}`}>
                  {meta}
                </Link>
              ) : (
                <a
                  className={styles.item}
                  href={a.noteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {meta}
                </a>
              )}
            </li>
          )
        })}
      </ul>

      <footer className={styles.footer}>
        <span>© {new Date().getFullYear()} kyaukyuai</span>
      </footer>
    </main>
  )
}
