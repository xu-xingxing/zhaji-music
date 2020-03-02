<template>
  <scroll @beforeScroll="listScroll" :beforeScroll="beforeScroll" class="suggest" :data="result" :pullup="pullup" @scrollToEnd="searchMore" ref="suggest">
    <ul class="suggest-list">
      <li @click="selectItem(item)" class="suggest-item" v-for="(item, index) in result" :key="index">
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <loading v-show="hasMore" title=""></loading>
      <div v-show="!hasMore && !result.length" class="no-result-wrapper">
        <no-result title="抱歉，暂无搜索结果"></no-result>
      </div>
    </ul>
  </scroll>
</template>

<script type="text/ecmascript-6">
// import {search} from 'api/search'
import {getSearch} from 'api/search'
import {ERR_OK} from 'api/config'
import {createSong} from 'common/js/song'
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import Singer from 'common/js/singer'
import {mapMutations, mapActions} from 'vuex'
import NoResult from 'base/no-result/no-result'

const TYPE_SINGER = 'singer'
// const perpage = 20
export default {
  props: {
    query: {
      type: String,
      default: ''
    },
    showSinger: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      page: 1,
      result: [],
      pullup: true,
      // 判断关键词结果列表是否显示完
      hasMore: true,
      beforeScroll: true
    }
  },
  components: {
    Scroll,
    Loading,
    NoResult
  },
  // 当query发生变化的时候，调用服务端接口获取数据
  watch: {
    query (newQuery) {
      this._search()
    }
  },
  methods: {
    _search () {
      // 当query变化的时候，要有重置操作
      this.page = 1
      this.hasMore = true
      this.$refs.suggest.scrollTo(0, 0)
      getSearch().then((res) => {
        if (res.code === ERR_OK) {
          this.result = this._genResult(res.data)
          this._checkMore(res.data)
        }
      })
    },
    // 由于跨域问题，向服务器发送请求，改为请求本地mock文件夹中的json数据
    // search () {
    //   // 请求服务端抓取检索数据渲染到列表里面
    //   search(this.query, this.page, this.showSinger, perpage).then((res) => {
    //     console.log(res)
    //     if (res.code === ERR_OK) {
    //       console.log(res.data)
    //       this.result = this._genResult(res.data)
    //     }
    //   })
    // },
    _genResult (data) {
      let ret = []
      if (data.zhida && data.zhida.singerid) {
        // 使用对象扩展运算符，将多个对象放到同一个对象里
        ret.push({...data.zhida, ...{type: TYPE_SINGER}})
      }
      if (data.song) {
        ret = ret.concat(this._normalizeSong(data.song.list))
      }
      return ret
    },
    getIconCls (item) {
      if (item.type === TYPE_SINGER) {
        return 'icon-mine'
      } else {
        return 'icon-music'
      }
    },
    getDisplayName (item) {
      if (item.type === TYPE_SINGER) {
        return item.singername
      } else {
        return `${item.name} - ${item.singer}`
      }
    },
    _normalizeSong (list) {
      let ret = []
      list.forEach((muiscData) => {
        if (muiscData.songid && muiscData.albumid) {
          ret.push(createSong(muiscData))
        }
      })
      return ret
    },
    // 下拉刷新，搜索更多
    searchMore () {
      if (!this.hasMore) {
        return
      }
      // 真正的想后台拉取数据
      // this.page++
      // search(this.query, this.page, this.showSinger, perpage).then((res) => {
      //   console.log(res)
      //   if (res.code === ERR_OK) {
      //     console.log(res.data)
      //     this.result = this._genResult(res.data)
      //   }
      // })
      getSearch().then((res) => {
        if (res.code === ERR_OK) {
          this.result = this.result.concat(this._genResult(res.data))
          this._checkMore(res.data)
        }
      })
    },
    // 检索是否加载完毕
    _checkMore (data) {
      const song = data.song
      if (!song.list.length || (song.curnum + song.curpage * 20) >= song.totalnum) {
        this.hasMore = false
      }
    },
    // 跳转到歌手详情页
    selectItem (item) {
      if (item.type === TYPE_SINGER) {
        const singer = new Singer({
          id: item.singermid,
          name: item.singername
        })
        this.$router.push({
          path: `/search/${singer.id}`
        })
        // 将singer写入到vuex中
        this.setSinger(singer)
      } else {
        this.insertSong(item)
      }

      // 向外派发事件
      this.$emit('select')
    },
    // 列表有滚动
    listScroll () {
      this.$emit('listScroll')
    },
    refresh () {
      this.$refs.suggest.refresh()
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    }),
    ...mapActions([
      'insertSong'
    ])
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          color: $color-text-d
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden
        .text
          no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
