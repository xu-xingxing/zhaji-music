<template>
  <scroll class="listview" :data="data" ref="listview" :listenScroll="listenScroll" @scroll="scroll" :probeType="probeType">
    <ul>
      <li v-for="(group,index) in data" class="list-group" :key="index" ref="listGroup">
          <h2 class="list-group-title">{{group.title}}</h2>
          <ul>
              <li @click="selectItem(item)" v-for="item in group.items" class="list-group-item" :key="item.id">
                <img class="avatar" v-lazy="item.avatar" alt="">
                <span class="name">{{item.name}}</span>
              </li>
          </ul>
      </li>
    </ul>
    <div class="list-shortcut" @touchstart="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove">
      <ul>
        <li class="item"
            v-for="(item,index) in shortcutList"
            :key="index"
            :data-index="index"
            :class="{'current':currentIndex === index}"
        >
          {{item}}
        </li>
      </ul>
    </div>
    <div class="list-fixed" v-show="fixedTitle" ref="fixed">
      <h1 class="fixed-title">
          {{fixedTitle}}
      </h1>
    </div>
    <div v-show="!data.length" class="loading-container">
      <loading></loading>
    </div>
  </scroll>
</template>

<script>
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import {getData} from 'common/js/dom'
// 通过右侧字母列表的每个item的高度=padding+字体大小=18
const ANCHOR_HEIGHT = 18
const TITLE_HEIGHT = 30
export default {
  props: {
    data: {
      type: Array,
      default: () => []
    }
  },
  created () {
    this.touch = {}
    this.listenScroll = true
    this.listHeight = []
    this.probeType = 3
  },
  data () {
    return {
      scrollY: -1,
      currentIndex: 0,
      diff: -1
    }
  },
  components: {
    Scroll,
    Loading
  },
  computed: {
    // 右侧字母快速列表(热，A，B。。。)
    shortcutList () {
      // 使用数组的map方法，改变数据用map
      return this.data.map((group) => {
        return group.title.substr(0, 1)
      })
    },
    fixedTitle () {
      if (this.scrollY > 0) {
        return ''
      }
      return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
    }
  },
  methods: {
    onShortcutTouchStart (e) {
      // console.log(e.target)
      // 获取当前点击的那个字母的索引
      let anchorIndex = getData(e.target, 'index')
      let firstTouch = e.touches[0]
      this.touch.y1 = firstTouch.pageY
      this.touch.anchorIndex = anchorIndex
      // 将dom元素listview调用scroll的方法，滚动到listGroup数组中的对应位置
      // console.log(this.$refs.listGroup[anchorIndex])
      // console.log(this.$refs.listGroup)
      this._scrollTo(anchorIndex)
    },
    onShortcutTouchMove (e) {
      let firstTouch = e.touches[0]
      this.touch.y2 = firstTouch.pageY
      let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0
      let anchorIndex = parseInt(this.touch.anchorIndex) + delta
      this._scrollTo(anchorIndex)
    },
    scroll (pos) {
      this.scrollY = pos.y
    },
    _scrollTo (index) {
      console.log(index)
      // 当index = null 或 index !== 0 直接返回不执行
      if (!index && index !== 0) {
        return
      }
      if (index < 0) {
        index = 0
      } else if (index > this.listHeight.length - 2) {
        index = this.listHeight.length - 2
      }
      this.scrollY = -this.listHeight[index]
      this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
    },
    _calculateHeight () {
      this.listHeight = []
      const list = this.$refs.listGroup
      // 一开始的height为0
      let height = 0
      this.listHeight.push(height)
      // 遍历这个listGoup的每个元素
      for (let i = 0; i < list.length; i++) {
        // 得到每个list元素
        let item = list[i]
        // 通过元素的clientHeight属性获取每个元素的高度
        height += item.clientHeight
        // 将其放置在数组中
        this.listHeight.push(height)
      }
      // console.log(this.listHeight)
    },
    selectItem (item) {
      this.$emit('select', item)
    },
    refresh () {
      this.$refs.listview.refresh()
    }
  },
  watch: {
    data () {
      setTimeout(() => {
        this._calculateHeight()
      }, 20)
    },
    // 观测scrollY的变化
    scrollY (newY) {
      // newY是个负值
      // 保留listHeight
      const listHeight = this.listHeight
      // 当滚动到顶部， newY>0
      if (newY > 0) {
        this.currentIndex = 0
        return
      }
      // 在中间部分滚动
      // 遍历listHeight
      for (let i = 0; i < listHeight.length - 1; i++) {
        // 每个list的上限
        let height1 = listHeight[i]
        // 每个list的下限
        let height2 = listHeight[i + 1]
        // !height2 意味着遍历到最后一个
        if (!height2 || ((-newY) >= height1 && (-newY) < height2)) {
          // 意味着滚动到上限和下限中间
          this.currentIndex = i
          // 获的当前的索引，用于字母列表的字母的高亮
          this.diff = height2 + newY
          // console.log(this.currentIndex)
          return
        }
      }
      // 当滚动到底部，且-newY大于最后一个元素的上限
      this.currentIndex = this.listHeight.length - 2
    },
    diff (newVal) {
      let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0
      // 因为diff是实时变化，当不在fixedTop不再0-30之间改变，则不需要改变
      if (this.fixedTop === fixedTop) {
        return
      }
      this.fixedTop = fixedTop
      this.$refs.fixed.style.transform = `translate3d(0, ${fixedTop}px, 0)`
    }
  }
}
</script>

<style lang="stylus" scoped>
 @import "~common/stylus/variable"

  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: -1px
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
