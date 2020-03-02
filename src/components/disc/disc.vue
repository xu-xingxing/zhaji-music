<template>
  <transition name="slide">
    <music-list :songs="songs" :title="title" :bg-image="bgImage"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
import MusicList from 'components/music-list/music-list'
import {mapGetters} from 'vuex'
import {getSongList} from 'api/recommend'
// import {ERR_OK} from 'api/config'
import {createSong} from 'common/js/song'
export default {
  data () {
    return {
      songs: []
    }
  },
  created () {
    this._getSongList()
  },
  methods: {
    _getSongList () {
      if (!this.disc.dissid) {
        this.$router.push('/recommend')
        return
      }
      getSongList(this.disc.dissid).then((res) => {
        this.songs = res.cdlist[0].songlist
        console.log(res.cdlist[0].songlist)
      })
    },
    // 数据转换,由于后台数据跨域限制，所以选择本地mock数据，此方法未用到
    _normalizeSongs (list) {
      let ret = []
      list.foreach((musicData) => {
        if (musicData.songid && musicData.albumid) {
          ret.push(createSong(musicData))
        }
      })
      return ret
    }
  },
  computed: {
    title () {
      return this.disc.dissname
    },
    bgImage () {
      return this.disc.imgurl
    },
    ...mapGetters([
      'disc'
    ])
  },
  components: {
    MusicList
  }
}
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable"
    .slide-enter-active, .slide-leave-active
      transition: all 0.3s
    .slide-enter, .slide-leave-to
      transform: translate3d(100%, 0, 0)
</style>
