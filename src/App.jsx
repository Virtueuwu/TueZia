import React, { useState, useEffect } from 'react'
import Movies from './pages/Movies.jsx'
import TV from './pages/TV.jsx'
import Bookmarks from './pages/Bookmarks.jsx'
import Recent from './pages/Recent.jsx'
import styles from './App.module.css'

function clearMovieSession() {
  ['mv_query', 'mv_player'].forEach(k => sessionStorage.removeItem(k))
}

export default function App() {
  const [tab, setTab] = useState(() => sessionStorage.getItem('cs_tab') || 'movies')
  const [theme, setTheme] = useState(() => localStorage.getItem('cs_theme') || 'light')
  const [homeKey, setHomeKey] = useState(0)

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark')
    } else {
      document.documentElement.removeAttribute('data-theme')
    }
    localStorage.setItem('cs_theme', theme)
  }, [theme])

  function goTab(t) {
    setTab(t)
    sessionStorage.setItem('cs_tab', t)
  }

  function goHome() {
    clearMovieSession()
    setTab('movies')
    sessionStorage.setItem('cs_tab', 'movies')
    setHomeKey(k => k + 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <button className={styles.logo} onClick={goHome} aria-label="Go to home">
          <span className={styles.logoAccent}>TueZia</span><span className={styles.logoDot}> • </span>BBtime
        </button>
        <nav className={styles.tabs}>
          <button className={`${styles.tab} ${tab === 'movies' ? styles.active : ''}`} onClick={() => goTab('movies')}>
            Movies
          </button>
          <button className={`${styles.tab} ${tab === 'tv' ? styles.active : ''}`} onClick={() => goTab('tv')}>
            TV Series
          </button>
          <button className={`${styles.tab} ${tab === 'bookmarks' ? styles.active : ''}`} onClick={() => goTab('bookmarks')}>
            Bookmarks
          </button>
          <button className={`${styles.tab} ${tab === 'recent' ? styles.active : ''}`} onClick={() => goTab('recent')}>
            Recent
          </button>
        </nav>
        <div className={styles.headerControls}>
          <button className={styles.iconBtn} onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')} aria-label="Toggle theme">
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </header>

      <main className={styles.main}>
        {tab === 'movies' && <Movies key={homeKey} />}
        {tab === 'tv' && <TV />}
        {tab === 'bookmarks' && <Bookmarks />}
        {tab === 'recent' && <Recent />}
      </main>

      <footer className={styles.footer}>
        <p className={styles.footerText}>
          &copy; 2026 I LOVE YOU BABY NAKO | PS: VIRTUE
        </p>
      </footer>
    </div>
  )
}
