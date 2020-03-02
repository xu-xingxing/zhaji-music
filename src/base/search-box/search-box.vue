<template>
  <div class="search-box">
    <i class="icon-search"></i>
    <input type="text" class="box" v-model="query" :placeholder="placeholder" ref="query">
    <i class="icon-dismiss" v-show="query" @click="clear"></i>
  </div>
</template>

<script type="text/ecmascript-6">
import {debounce} from 'common/js/util'
export default {
  props: {
    placeholder: {
      type: String,
      default: '歌手'
    }
  },
  data () {
    return {
      query: ''
    }
  },
  methods: {
    clear () {
      this.query = ''
    },
    // 将热门搜索中的关键词，添加到搜索框
    setQuery () {
      this.$on('changeQuery', (res) => {
        this.query = res
      })
    },
    blur () {
      this.$refs.query.blur()
    }
  },
  // 为什么要在created里面，使用this.$watch ?
  created () {
    // 对search搜索做节流
    this.$watch('query', debounce((newQuery) => {
      this.$emit('query', newQuery)
    }, 200))
  },
  mounted () {
    this.setQuery()
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .search-box
    display: flex
    align-items: center
    box-sizing: border-box
    width: 100%
    padding: 0 6px
    height: 40px
    background: $color-highlight-background
    border-radius: 6px
    .icon-search
      font-size: 24px
      color: $color-background
    .box
      flex: 1
      margin: 0 5px
      line-height: 18px
      background: $color-highlight-background
      color: $color-text
      font-size: $font-size-medium
      &::placeholder
        color: $color-text-d
    .icon-dismiss
      font-size: 16px
      color: $color-background
</style>
