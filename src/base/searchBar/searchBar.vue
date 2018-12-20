<template>
<div class="input-wrap">
  <span class="iconfont icon-search"></span>
  <input ref="query" v-model="query" class="input" :placeholder="placeholder">
  <span @click="clear" v-show="query" class="iconfont icon-close"></span>
</div>
</template>

<script>
import { debounce } from 'common/js/util'
export default {
  props: {
    placeholder: {
      type: String,
      default: '搜索用户昵称'
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
    }
  },
  created () {
    // 防抖函数
    this.$watch('query', debounce((newQuery) => {
      this.$emit('query', newQuery)
    }, 200))
  }
}
</script>

<style scoped lang='stylus'>
@import '~@/common/stylus/variable'
.input-wrap
  width 100%
  background rgb(36, 38, 48)
  border-radius 5px
  height 44px
  display flex
  justify-content center
  align-items center
  .iconfont
    margin-left 10px
    font-size 21px
  .icon-close
    font-size $font-size-small
    margin-right 10px
    padding 5px
  .input
    height 21px
    background rgb(26, 27, 32)
    flex 1
    font-size $font-size-medium
    color $color-text
    padding-left 10px
    background none
    caret-color $color-point
    &:focus
      outline none
      border none
</style>
