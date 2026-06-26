import { useEffect, useState } from 'react'
import styles from './Presentation.module.css'
import type { Slide } from '../data/content'

type Props = {
  deck: Slide[]
  onClose: () => void
}

export function Presentation({ deck, onClose }: Props) {
  const [i, setI] = useState(0)
  const total = deck.length
  const next = () => setI((x) => Math.min(total - 1, x + 1))
  const prev = () => setI((x) => Math.max(0, x - 1))

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault()
        next()
      } else if (e.key === 'ArrowLeft') {
        prev()
      } else if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total, onClose])

  const s = deck[i]

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true">
      <header className={styles.bar}>
        <span className={styles.counter}>
          {i + 1} / {total}
        </span>
        <button className={styles.close} onClick={onClose} aria-label="閉じる">
          ✕ 閉じる
        </button>
      </header>

      <div className={styles.stage}>
        <div className={styles.slide} key={i}>
          {s.kind === 'title' ? (
            <div className={styles.titleSlide}>
              <h1>{s.title}</h1>
              {s.bullets[0] && <p className={styles.meta}>{s.bullets[0]}</p>}
            </div>
          ) : (
            <div
              className={`${styles.contentSlide} ${s.image ? styles.split : ''}`}
            >
              <div className={styles.text}>
                <h2 className={styles.slideTitle}>{s.title}</h2>
                {s.bullets.length > 0 && (
                  <ul className={styles.bullets}>
                    {s.bullets.map((b, k) => (
                      <li key={k} dangerouslySetInnerHTML={{ __html: b }} />
                    ))}
                  </ul>
                )}
              </div>
              {s.image && (
                <img className={styles.slideImage} src={s.image} alt="" />
              )}
            </div>
          )}
        </div>
      </div>

      <footer className={styles.controls}>
        <button onClick={prev} disabled={i === 0} aria-label="前へ">
          ←
        </button>
        <span className={styles.hint}>← → / Space で移動・Esc で閉じる</span>
        <button onClick={next} disabled={i === total - 1} aria-label="次へ">
          →
        </button>
      </footer>
    </div>
  )
}
