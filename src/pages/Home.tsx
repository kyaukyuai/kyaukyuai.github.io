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
              data-umami-event="home-work"
              data-umami-event-name={w.title}
            >
              <span className={styles.tag}>{categoryLabel[w.category]}</span>
              <span className={styles.cardTitle}>{w.title}</span>
              <span className={styles.cardDesc}>{w.description}</span>
            </a>
          </li>
        ))}
        <li>
          <Link
            className={`${styles.card} ${styles.articlesCard}`}
            to="/articles"
            data-umami-event="home-articles"
          >
            <span className={styles.tag}>articles</span>
            <span className={styles.cardTitle}>記事一覧</span>
            <span className={styles.cardDesc}>
              公開した {articles.length} 本の記事を読む
            </span>
          </Link>
        </li>
      </ul>

      <section className={styles.recent}>
        <div className={styles.recentHead}>
          <h2 className={styles.recentTitle}>最近の記事</h2>
          <Link to="/articles" className={styles.recentMore}>
            すべて見る →
          </Link>
        </div>
        <ul className={styles.recentList}>
          {articles.slice(0, 5).map((a) => {
            const inner = (
              <>
                <time className={styles.recentDate}>{a.date}</time>
                <span className={styles.recentName}>{a.title}</span>
                <span className={styles.recentMag}>{a.magazine}</span>
              </>
            )
            return (
              <li key={a.slug}>
                {a.selfHosted ? (
                  <Link
                    className={styles.recentRow}
                    to={`/articles/${a.slug}`}
                    data-umami-event="home-recent"
                    data-umami-event-slug={a.slug}
                  >
                    {inner}
                  </Link>
                ) : (
                  <a
                    className={styles.recentRow}
                    href={a.noteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-umami-event="home-recent"
                    data-umami-event-slug={a.slug}
                  >
                    {inner}
                  </a>
                )}
              </li>
            )
          })}
        </ul>
      </section>

      <footer className={styles.footer}>
        <span>© {new Date().getFullYear()} kyaukyuai</span>
      </footer>
    </main>
  )
}
