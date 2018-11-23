<template>
  <div class="vux-swipeout">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'swipeout'
}
</script>

<style lang="stylus">
@import '~@/common/stylus/variable'
.vux-swipeout
  flex 1
.vux-swipeout-item
  flex 1
  position relative
.vux-swipeout-button-box
  position absolute
  top 0
  right 0
  bottom 0
  left: 0
  font-size 0
  text-align right
.vux-swipeout-button-box-left
  text-align left
.vux-swipeout-button-box > div
  display flex
  height 100%
.vux-swipeout-button
  flex 1
  line-height 46px
  padding-right 25px
  font-size 14px
  color $color-white
  border 2px solid $color-background
.vux-swipeout-content
  position relative
  background @swipeout-content-bg-color
.vux-swipeout-content.vux-swipeout-content-animated
  transition transform 0.5s
.vux-swipeout-button-primary
  background-color @swipeout-button-primary-bg-color
.vux-swipeout-button-warn
  background-color $color-warn
.vux-swipeout-button-default
  background-color @swipeout-button-default-bg-color
</style>
