import { Link } from 'react-router-dom'
import styles from './Home.module.css'
import { works, type Work } from '../data/works'
import { articles } from '../data/articles'

const categoryLabel: Record<Work['category'], string> = {
  magazine: 'note',
  sns: 'SNS',
  code: 'code',
}

export function Home() {
  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <h1 className={styles.title}>kyaukyuai</h1>
      </header>

      <ul className={styles.grid}>
        {works.map((w) => (
          <li key={w.url}>
            <a
              className={styles.card}
              href={w.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className={styles.tag}>{categoryLabel[w.category]}</span>
              <span className={styles.cardTitle}>{w.title}</span>
              <span className={styles.cardDesc}>{w.description}</span>
            </a>
          </li>
        ))}
        <li>
          <Link className={`${styles.card} ${styles.articlesCard}`} to="/articles">
            <span className={styles.tag}>articles</span>
            <span className={styles.cardTitle}>記事一覧</span>
            <span className={styles.cardDesc}>
              公開した {articles.length} 本の記事を読む
            </span>
          </Link>
        </li>
      </ul>

      <footer className={styles.footer}>
        <span>© {new Date().getFullYear()} kyaukyuai</span>
      </footer>
    </main>
  )
}
