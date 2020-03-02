<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
export default {
  props: {
    // 是否节流
    probeType: {
      type: Number,
      default: 1
    },
    click: {
      type: Boolean,
      default: true
    },
    data: {
      type: Array,
      default: null
    },
    // 用来让scroll要不要去监听滚动事件
    listenScroll: {
      type: Boolean,
      default: false
    },
    pullup: {
      type: Boolean,
      default: false
    },
    beforeScroll: {
      type: Boolean,
      default: false
    },
    refreshDelay: {
      type: Number,
      defalut: 20
    }
  },
  mounted () {
    setTimeout(() => {
      this._initScroll()
    }, 20)
  },
  methods: {
    _initScroll () {
      // 如果wrapper没有值的时候不执行
      if (!this.$refs.wrapper) {
        return
      }
      this.scroll = new BScroll(this.$refs.wrapper, {
        probeType: this.probeType,
        click: this.click
      })
      // 监听scroll的滚动事件，此时派发一个pos，当前滚动列表的位置
      if (this.listenScroll) {
        let me = this
        this.scroll.on('scroll', (pos) => {
          me.$emit('scroll', pos)
        })
      }
      // 上拉刷新功能的实现，当滚动结束会派发一个scrollEnd事件，对其进行监听
      // scrollEnd 滚动停止
      // scrollToEnd 滚动到底部
      if (this.pullup) {
        this.scroll.on('scrollEnd', () => {
          if (this.scroll.y <= this.scroll.maxScrollY + 50) {
            this.$emit('scrollToEnd')
          }
        })
      }
      if (this.beforeScroll) {
        // 在列表滚动前，会派发一个beforeScrollStart事件
        this.scroll.on('beforeScrollStart', () => {
          this.$emit('beforeScroll')
        })
      }
    },
    // 代理better-scroll的enable方法
    enable () {
      this.scroll && this.scroll.enable()
    },
    // 代理better-scroll的disable方法
    disable () {
      this.scroll && this.scroll.disable()
    },
    // 代理better-scroll的refresh方法
    refresh () {
      this.scroll && this.scroll.refresh()
    },
    // 代理better-scroll的scrollTo方法
    scrollTo () {
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
    },
    // 代理better-scroll的scrollToElement方法
    scrollToElement () {
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
    }
  },
  watch: {
    data () {
      // console.log('数据改变了')
      setTimeout(() => {
        this.refresh()
      }, this.refreshDelay)
    }
  }
}
</script>

<style lang="stylus" scoped>

</style>
