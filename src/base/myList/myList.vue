<template>
<div class="myList">
  <div class="topBar">
    <span class="backbtn iconfont icon-left" @click="GoBack"></span>
    <p class="title">{{Title}}</p>
  </div>
  <scroll class="scroll-wrap" :class=" {'scroll-wrap-bottom':needBottomMargin }" :pullup="true" @scrollToEnd="scrollToEnd">
    <ul>
      <slot></slot>
    </ul>
  </scroll>
</div>
</template>

<script>
import Scroll from 'base/scroll/scroll'
export default {
  props: {
    Title: {
      type: String,
      default: ''
    },
    needBottomMargin: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    GoBack () {
      this.$router.back()
    },
    scrollToEnd () {
      this.$emit('scrollToEnd')
    }
  },
  components: {
    Scroll
  }
}
</script>

<style scoped lang='stylus'>
@import '~@/common/stylus/variable'
.myList
  .topBar
    position fixed
    z-index 33
    width 100%
    display flex
    height 44px
    border-bottom 1px solid $color-divide
    background $color-background
    .title
      margin-right 44px
      flex 1
      line-height 44px
      text-align center
      font-size $font-size-medium-x
    .backbtn
      display flex
      justify-content center
      align-items center
      height 44px
      width 44px
  .scroll-wrap
    position fixed
    top 0
    left 0
    bottom 0
    right 0
    margin-top 44px
  .scroll-wrap-bottom
    margin-bottom 44px
</style>
