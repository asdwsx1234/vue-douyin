<template>
  <div>
    <img class="cover" src="./1.jpg" alt="">
    <div class="desc">
        <div v-if="item.type == 1">
          <i class="icon iconfont icon-delete"></i>本地草稿箱
        </div>
        <div v-else-if="item.type == 2">
          <i class="icon iconfont icon-heart"></i>4.1w
        </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped lang='stylus'>
@import '~@/common/stylus/variable'
.cover
  height 100%
  width 100%
.desc
  position absolute
  left 5px
  bottom 5px
  font-size $font-size-small
  .icon
    display inline-block
    width 12px
    height 12px
    font-size 12px
    margin-right 5px
    vertical-align top
</style>
