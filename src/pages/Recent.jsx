import React, { useState } from 'react'
import { getRecent } from '../lib/storage.js'
import { movieEmbedUrl, tvEmbedUrl, formatRating, getYear } from '../lib/api.js'
import Player from '../components/Player.jsx'
import styles from './Recent.module.css'
import { posterUrl } from '../lib/api.js'

function timeAgo(ts) {
  const diff = Date.now() - ts
  const m = Math.floor(diff / 60000)
  const h = Math.floor(diff / 3600000)
  const d = Math.floor(diff / 86400000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  if (h < 24) return `${h}h ago`
  return `${d}d ago`
}

function fullDate(ts) {
  return new Date(ts).toLocaleString()
}

export default function Recent() {
  const [items] = useState(() => getRecent())
  const [player, setPlayer] = useState(null)

  function select(item) {
    const type = item._type || 'movie'
    const src = type === 'movie'
      ? movieEmbedUrl(item.id)
      : tvEmbedUrl(item.id, 1, 1)
    const title = type === 'movie' ? item.title : item.name
    const date = type === 'movie' ? item.release_date : item.first_air_date
    setPlayer({
      src,
      title,
      year: getYear(date),
      rating: formatRating(item.vote_average),
      overview: item.overview?.slice(0, 220),
      badge: item._extraInfo || undefined,
      selectedId: item.id,
      item,
      type,
    })
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 80)
  }

  if (items.length === 0) {
    return (
      <p style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)', fontSize: '15px' }}>
        🎬 Nothing watched yet — play a movie or show to track your history!
      </p>
    )
  }

  return (
    <div>
      {player && (
        <div>
          <Player {...player} onClose={() => setPlayer(null)} />
        </div>
      )}

      <p className={styles.sectionLabel}>Recently Watched</p>

      <div className={styles.list}>
        {items.map(item => {
          const type = item._type || 'movie'
          const title = type === 'movie' ? item.title : item.name
          const date = type === 'movie' ? item.release_date : item.first_air_date
          const poster = posterUrl(item.poster_path)
          const rating = formatRating(item.vote_average)
          const year = getYear(date)
          const isSelected = player?.selectedId === item.id

          return (
            <div
              key={`${item.id}-${item._lastWatched}`}
              className={`${styles.row} ${isSelected ? styles.rowSelected : ''}`}
              onClick={() => select(item)}
            >
              <div className={styles.thumb}>
                {poster
                  ? <img src={poster} alt={title} />
                  : <div className={styles.thumbFallback}>🎬</div>
                }
                <div className={styles.playOverlay}>▶</div>
              </div>

              <div className={styles.info}>
                <div className={styles.title}>{title}</div>
                <div className={styles.meta}>
                  {year && <span>{year}</span>}
                  {rating && <span>★ {rating}</span>}
                  {item._extraInfo && <span className={styles.badge}>{item._extraInfo}</span>}
                  <span className={styles.typeTag}>{type === 'movie' ? '🎬 Movie' : '📺 TV'}</span>
                </div>
                {item.overview && <p className={styles.overview}>{item.overview.slice(0, 100)}…</p>}
              </div>

              <div className={styles.timestampBlock}>
                <span className={styles.timeAgo}>{timeAgo(item._lastWatched)}</span>
                <span className={styles.fullDate}>{fullDate(item._lastWatched)}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
