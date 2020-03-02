<template>
  <transition name="slide">
    <music-list :songs="songs" :title="title" :bg-image="bgImage"></music-list>
  </transition>
</template>

<script>
import {mapGetters} from 'vuex'
import {getSingerDetail, getSongVkey} from 'api/singer'
import {ERR_OK} from 'api/config'
import {createSong} from 'common/js/song'
import MusicList from 'components/music-list/music-list'

export default {
  name: 'singer-detail',
  data () {
    return {
      songs: []
    }
  },
  computed: {
    title () {
      return this.singer.name
    },
    bgImage () {
      return this.singer.avatar
    },
    ...mapGetters([
      'singer'
    ])
  },
  created () {
    this._getDetail()
  },
  methods: {
    _getDetail () {
      if (!this.singer.id) {
        this.$router.push('/singer')
      }
      getSingerDetail(this.singer.id).then((res) => {
        if (res.code === ERR_OK) {
          this.songs = this._normalizeSongs(res.data.list)
        }
      })
    },
    // 重组 res.data.list 数据,只拿需要的
    _normalizeSongs (list) {
      let result = []
      list.forEach((item) => {
        // console.log('item',item)
        // 解构赋值-拿到item 下的 musicData 列表数据
        let {musicData} = item
        // ------------- 更新的加上vkey
        getSongVkey(musicData.songmid).then((res) => {
          const vkey = res.data.items[0].vkey
          // console.log(res.data)
          // console.log(vkey)
          if (musicData.songid && musicData.albummid) {
            result.push(createSong(musicData, vkey))
          }
        })
      })
      return result
    }
  },
  components: {
    MusicList
  }
}
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable"
  .singer-detail
    position: fixed
    z-index: 100
    top: 0
    left: 0
    right: 0
    bottom: 0
    background: #ccc
    .slide-enter-active, .slide-leave-active
      transition: all 0.3s
    .slide-enter, .slide-leave-to
      transform: translate3d(100%, 0, 0)
</style>
