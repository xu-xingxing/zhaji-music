import {mapGetters, mapMutations, mapActions} from 'vuex'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'

export const playlistMixin = {
  computed: {
    ...mapGetters([
      'playlist'
    ])
  },
  // 由组件dom ready的时候触发
  mounted () {
    this.handlePlayList(this.playlist)
  },
  // kepp-alive组件触发
  activated () {
    this.handlePlayList(this.playlist)
  },
  watch: {
    playlist (newVal) {
      this.handlePlayList(newVal)
    }
  },
  methods: {
    // 组件必须执行这个函数，
    // 如果组件中没有定义这个handlePlayList函数，就会使用mixin里面的函数，抛出错误，
    // 如果定义了就会把这个函数覆盖
    handlePlayList () {
      throw new Error('component must implement handlePlaylist method')
    }
  }
}

// player.vue与playlist.vue的逻辑共享
export const playerMixin = {
  computed: {
    // 获得播放模式
    iconMode () {
      return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
    },
    ...mapGetters([
      'sequenceList',
      'currentSong',
      'playlist',
      'mode',
      'favoriteList'
    ])
  },
  methods: {
    changeMode () {
      const mode = (this.mode + 1) % 3
      this.setPlayMode(mode)
      let list = null
      if (mode === playMode.random) {
        list = shuffle(this.sequenceList)
      } else {
        list = this.sequenceList
      }
      this.resetCurrentIndex(list)
      this.setPlayList(list)
    },
    // 重新设置当前的index
    resetCurrentIndex (list) {
      // findIndex es6的新方法
      let index = list.findIndex((item) => {
        // 在list中找到当前歌曲所对应的索引
        return item.id === this.currentSong.id
      })
      this.setCurrentIndex(index)
    },
    getFavoriteIcon (song) {
      if (this.isFavorite(song)) {
        return 'icon-favorite'
      }
      return 'icon-not-favorite'
    },
    toggleFavorite (song) {
      if (this.isFavorite(song)) {
        this.deleteFavoriteList(song)
      } else {
        this.saveFavoriteList(song)
      }
    },
    // 判断是否是喜欢的歌曲
    isFavorite (song) {
      const index = this.favoriteList.findIndex((item) => {
        return item.id === song.id
      })
      return index > -1
    },
    ...mapMutations({
      setPlayingState: 'SET_PLAYING_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayMode: 'SET_PLAY_MODE',
      setPlayList: 'SET_PLAYLIST'
    }),
    ...mapActions([
      'saveFavoriteList',
      'deleteFavoriteList'
    ])
  }
}
// add-song.vue和search.vue中有search相关的mixin可以复用代码
export const searchMixin = {
  data () {
    return {
      query: '',
      refreshDelay: 100
    }
  },
  computed: {
    ...mapGetters([
      'searchHistory'
    ])
  },
  methods: {
    // 收起移动端的键盘
    blurInput () {
      // 调用子组件searchBox的方法
      this.$refs.searchBox.blur()
    },
    // 保存搜索结果
    saveSearch () {
      this.saveSearchHistory(this.query)
    },
    onQueryChange (query) {
      this.query = query
    },
    addQuery (query) {
      // 可以拿到这个方法
      // console.log(this.$refs.searchBox.clear)
      // 拿不到这个方法
      // console.log(this.$refs.searchBox.setQuery)
      // 原因可能是由于自组件的dom未加载完毕
      // this.$refs.searchBox.setQuery(query)
      this.$refs.searchBox.$emit('changeQuery', query)
    },
    ...mapActions(
      [
        'saveSearchHistory',
        'deleteSearchHistory'
      ]
    )
  }
}
