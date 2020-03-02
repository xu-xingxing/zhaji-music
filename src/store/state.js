import {playMode} from 'common/js/config'
import {loadSearch, loadPlay, loadFavoriteList} from 'common/js/cache'
const state = {
  singer: {},
  playing: false,
  // 是否全屏
  fullScreen: false,
  // 播放列表
  playlist: [],
  // 顺序播放的列表
  sequenceList: [],
  // 播放模式
  mode: playMode.sequence,
  // 当前播放的歌曲的索引
  currentIndex: -1,
  disc: {},
  toplist: {},
  // 搜索历史
  searchHistory: loadSearch(),
  // 播放历史
  playHistory: loadPlay(),
  // 收藏列表
  favoriteList: loadFavoriteList()
}
export default state
