<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper" ref="progressBtn">
        <div
          class="progress-btn"
          @touchstart.prevent="progressTouchStart"
          @touchmove.prevent="progressTouchMove"
          @touchend="progressTouchEnd"
        ></div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import {prefixStyle} from 'common/js/dom'
const progressBtnWidth = 16
const transform = prefixStyle('transform')
export default {
  props: {
    percent: {
      type: Number,
      default: 0
    }
  },
  created () {
    this.touch = {}
  },
  methods: {
    progressTouchStart (e) {
      // 定义一个标识位，表示已经初始化了
      this.touch.initiated = true
      // 记录初始的点击位置
      this.touch.startX = e.touches[0].pageX
      // 记录按钮开始点击的时候已经在进度条说上偏移了多少
      this.touch.left = this.$refs.progress.clientWidth
    },
    progressTouchMove (e) {
      // 判断是否初始化,如果没有，直接返回不再执行下面的语句
      if (!this.touch.initiated) {
        return
      }
      // 获取到第一次点击和移动过程中点击的第一个点之间的距离，
      const deltax = e.touches[0].pageX - this.touch.startX
      // progressBtn移动的距离 = this.touch.left（初始的偏移量） + deltax（手指移动的距离)
      const offsetWidth = Math.min(this.$refs.progressBar.clientWidth - progressBtnWidth, Math.max(0, this.touch.left + deltax))
      // 设置进度条和按钮移动的位置,move的时候，时时改变进度条和按钮的位置
      this._offset(offsetWidth)
    },
    progressTouchEnd () {
      // 移动结束的时候，将初始值设为false
      this.touch.initiated = false
      // 需要派发一个事件更改percent
      this._triggerPercent()
    },
    progressClick (e) {
      // 改变进度条的偏移量
      // bug 当点击progressBtn的时候，e.offsetX 获取不对
      // this._offset(e.offsetX)
      const rect = this.$refs.progressBar.getBoundingClientRect()
      const offsetWidth = e.pageX - rect.left
      this._offset(offsetWidth)
      // 改变外层percent
      this._triggerPercent()
    },
    // 此函数的功能：设置进度条和按钮移动的位置
    _offset (offsetWidth) {
      this.$refs.progress.style.width = `${offsetWidth}px`
      this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px,0,0)`
    },
    _triggerPercent () {
      const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
      // 运动中的percent
      const percent = this.$refs.progress.clientWidth / barWidth
      this.$emit('percentChange', percent)
    }
  },
  watch: {
    percent (newPercent) {
      if (newPercent >= 0 && !this.touch.initiated) {
        const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
        const offsetWidth = newPercent * barWidth
        this._offset(offsetWidth)
      }
    }
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .progress-bar
    height: 30px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          background: $color-theme
</style>
