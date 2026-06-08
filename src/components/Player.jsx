import React, { useEffect, useRef } from 'react'
import { addRecent } from '../lib/storage.js'
import styles from './Player.module.css'

function PlayerContent({ src, title, year, rating, overview, badge, onClose, item, type }) {
  const iframeRef = useRef(null)

  // Log to recently watched as soon as the player opens
  useEffect(() => {
    if (!item) return
    addRecent(item, type || item._type || 'movie', badge || '')
  }, [src])

  if (!src) return null

  return (
    <div className={styles.wrap}>
      <div className={styles.meta}>
        <div className={styles.metaTop}>
          <h2 className={styles.title}>{title}</h2>
          {onClose && (
            <button className={styles.closeBtn} onClick={onClose} aria-label="Close player">✕</button>
          )}
        </div>
        <div className={styles.pills}>
          {year && <span className={styles.pill}>{year}</span>}
          {rating && <span className={`${styles.pill} ${styles.gold}`}>★ {rating}</span>}
          {badge && <span className={`${styles.pill} ${styles.badge}`}>{badge}</span>}
        </div>
        {overview && <p className={styles.overview}>{overview}</p>}
      </div>
      <div className={styles.playerBox}>
        <iframe
          ref={iframeRef}
          src={src}
          frameBorder="0"
          allowFullScreen
          allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
          title={title}
        />
      </div>
    </div>
  )
}

export default React.memo(PlayerContent)
