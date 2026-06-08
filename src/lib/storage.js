// ─── BOOKMARKS ────────────────────────────────────────────────────────────────
export function getBookmarks() {
  try { return JSON.parse(localStorage.getItem('cs_bookmarks')) || [] } catch { return [] }
}

export function toggleBookmark(item, type) {
  let list = getBookmarks()
  const exists = list.find(x => x.id === item.id)
  if (exists) {
    list = list.filter(x => x.id !== item.id)
  } else {
    list.unshift({ ...item, _type: type, _added: Date.now() })
  }
  localStorage.setItem('cs_bookmarks', JSON.stringify(list))
  return !exists
}

export function isBookmarked(id) {
  return getBookmarks().some(x => x.id === id)
}

// ─── RECENTLY WATCHED ─────────────────────────────────────────────────────────
export function getRecent() {
  try { return JSON.parse(localStorage.getItem('cs_recent')) || [] } catch { return [] }
}

export function addRecent(item, type, extraInfo = '') {
  let list = getRecent()
  list = list.filter(x => x.id !== item.id)
  list.unshift({
    ...item,
    _type: type,
    _lastWatched: Date.now(),
    _extraInfo: extraInfo,
  })
  if (list.length > 50) list = list.slice(0, 50)
  localStorage.setItem('cs_recent', JSON.stringify(list))
}
