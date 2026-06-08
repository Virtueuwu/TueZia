export const TMDB_KEY = 'a0cae6827a473cf1c0bcef8e0810dd51' // get tmdb api key free at https://www.themoviedb.org/settings/api
export const EMBED_API_KEY = 'nx_1047309d0ba5fd61ff8a95e9f4cd0157' // get movie api key at https://api.codespecters.com/api
export const EMBED_BASE = 'https://api.codespecters.com'
export const IMG_BASE = 'https://image.tmdb.org/t/p/w300'
export const IMG_BASE_LG = 'https://image.tmdb.org/t/p/w780'

// API Response Cache (expires after 10 minutes)
const apiCache = new Map()
const CACHE_TTL = 10 * 60 * 1000

function getCachedResponse(key) {
  const cached = apiCache.get(key)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data
  }
  apiCache.delete(key)
  return null
}

function setCachedResponse(key, data) {
  apiCache.set(key, { data, timestamp: Date.now() })
}

async function tmdbFetch(path) {
  const cacheKey = `tmdb:${path}`
  
  // Return cached data if available
  const cached = getCachedResponse(cacheKey)
  if (cached) return cached
  
  const sep = path.includes('?') ? '&' : '?'
  const res = await fetch(`https://api.themoviedb.org/3${path}${sep}api_key=${TMDB_KEY}`)
  if (!res.ok) throw new Error(`TMDB error: ${res.status}`)
  const data = await res.json()
  
  // Cache the response
  setCachedResponse(cacheKey, data)
  return data
}

export const api = {
  trendingMovies: () => tmdbFetch('/trending/movie/week'),
  trendingTV: () => tmdbFetch('/trending/tv/week'),
  searchMovies: (q) => tmdbFetch(`/search/movie?query=${encodeURIComponent(q)}`),
  searchTV: (q) => tmdbFetch(`/search/tv?query=${encodeURIComponent(q)}`),
  movieDetails: (id) => tmdbFetch(`/movie/${id}`),
  tvDetails: (id) => tmdbFetch(`/tv/${id}`),
  seasonDetails: (id, season) => tmdbFetch(`/tv/${id}/season/${season}`),
}

export function movieEmbedUrl(tmdbId) {
  return `${EMBED_BASE}/embed/movie/${tmdbId}?apikey=${EMBED_API_KEY}`
}

export function tvEmbedUrl(tmdbId, season, episode) {
  return `${EMBED_BASE}/embed/tv/${tmdbId}/${season}/${episode}?apikey=${EMBED_API_KEY}`
}

export function posterUrl(path, large = false) {
  if (!path) return null
  return (large ? IMG_BASE_LG : IMG_BASE) + path
}

export function formatRating(rating) {
  if (!rating) return null
  return parseFloat(rating).toFixed(1)
}

export function getYear(dateStr) {
  return (dateStr || '').slice(0, 4)
}
