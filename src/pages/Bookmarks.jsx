import React, { useState } from 'react'
import { getBookmarks, toggleBookmark } from '../lib/storage.js'
import { movieEmbedUrl, tvEmbedUrl, formatRating, getYear } from '../lib/api.js'
import MediaGrid from '../components/MediaGrid.jsx'
import Player from '../components/Player.jsx'
import styles from './Movies.module.css'

export default function Bookmarks() {
  const [items, setItems] = useState(() => getBookmarks())
  const [player, setPlayer] = useState(null)

  function refresh() { setItems(getBookmarks()) }

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
      selectedId: item.id,
      item,
      type,
    })
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 80)
  }

  function removeBookmark(item) {
    toggleBookmark(item, item._type)
    refresh()
  }

  if (items.length === 0) {
    return (
      <div className={styles.empty}>
        <p style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)', fontSize: '15px' }}>
          🔖 No bookmarks yet — hover a card and click the bookmark icon to save!
        </p>
      </div>
    )
  }

  return (
    <div>
      {player && (
        <div>
          <Player {...player} onClose={() => setPlayer(null)} />
        </div>
      )}
      <p className={styles.sectionLabel}>Bookmarks</p>
      <MediaGrid
        items={items}
        loading={false}
        onSelect={select}
        selectedId={player?.selectedId}
      />
    </div>
  )
}
