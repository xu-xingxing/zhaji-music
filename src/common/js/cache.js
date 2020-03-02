// 主要操作和storage相关逻辑
import storage from 'good-storage'

const SEARCH_KEY = '__search__'
const SEARCH_MAX_LENGTH = 15

const PLAY_KEY = '__play__'
const PLAY_MAX_LENGTH = 200

const FAVORITE_KEY = '__favorite__'
const FAVORITE_MAX_LENGTH = 200

function insertArray (arr, val, compare, maxLen) {
  // 先查找arr中有没有这个val
  const index = arr.findIndex(compare)
  // 说明他是第一个数据，什么都不做
  if (index === 0) {
    return
  }
  // 如果有的话，将其删掉再插入
  if (index > 0) {
    arr.splice(index, 1)
  }
  // 如果说没有这个数据，就直接插入到头部
  arr.unshift(val)
  // 如果当前数组的长度超过了maxLen，从尾部删除一个元素，即删除最老的元素
  if (maxLen && arr.length > maxLen) {
    arr.pop()
  }
}
// 搜索列表 数据结构 -》 最大缓存15条数据 超过15条数据，将最老的数据踢出去， 每次的数据在数组的第一个
export function saveSearch (query) {
  // 实现localstorage的缓存
  let searches = storage.get(SEARCH_KEY, [])
  insertArray(searches, query, (item) => {
    return item === query
  }, SEARCH_MAX_LENGTH)
  storage.set(SEARCH_KEY, searches)
  return searches
}
// 从本地缓存中读取search列表
export function loadSearch () {
  return storage.get(SEARCH_KEY, [])
}

function deleteFromArray (arr, compare) {
  const index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
}

// 删除本地缓存中的一条数据
export function deleteSearch (query) {
  let searches = storage.get(SEARCH_KEY, [])
  deleteFromArray(searches, (item) => {
    return item === query
  })
  storage.set(SEARCH_KEY, searches)
  return searches
}
// 删除本地缓存中的所有searchHistory的数据
export function clearSearch () {
  // 清空本地数据
  storage.remove(SEARCH_KEY)
  return []
}

// 对播放列表的存储
export function savePlay (song) {
  let songs = storage.get(PLAY_KEY, [])
  insertArray(songs, song, (item) => {
    return item.id === song.id
  }, PLAY_MAX_LENGTH)
  storage.set(PLAY_KEY, songs)
  return songs
}

export function loadPlay () {
  return storage.get(PLAY_KEY, [])
}

// 收藏喜欢的歌曲
export function saveFavorite (song) {
  // 先从本地读取喜欢的歌曲
  let songs = storage.get(FAVORITE_KEY, [])
  insertArray(songs, song, (item) => {
    return song.id === item.id
  }, FAVORITE_MAX_LENGTH)
  storage.set(FAVORITE_KEY, songs)
  return songs
}

// 删除喜欢的歌曲
export function deleteFavorite (song) {
  let songs = storage.get(FAVORITE_KEY, [])
  deleteFromArray(songs, (item) => {
    return song.id === item.id
  })
  storage.set(FAVORITE_KEY, songs)
  return songs
}

// 初始状态的时候，加载所有的favorite列表
export function loadFavoriteList () {
  return storage.get(FAVORITE_KEY, [])
}
