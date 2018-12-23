<template>
<div class="row">
  <input class="input" type="text" id="code" placeholder="输入邮箱验证码">
  <div class="code-btn">获取验证码</div>
</div>
</template>

<script>
export default {

}
</script>

<style scoped lang='stylus'>
@import '~@/common/stylus/variable'
.row
  display flex
  .input
    height 44px
    color white
    background rgba(255, 255, 255, .3)
    padding-left 10px
    border-top-left-radius 4px
    border-bottom-left-radius 4px
    border-top-right-radius 0
    border-bottom-right-radius 0
    caret-color $color-point
    &:focus
      outline none
      border none
    &::placeholder
      color rgb(194, 142, 253)
  .code-btn
    flex 1
    margin-left 5px
    color rgb(207, 174, 253)
    font-weight 600
    font-size $font-size-small
    text-align center
    line-height 44px
    background rgba(255, 255, 255, .3)
    border-top-right-radius 4px
    border-bottom-right-radius 4px
</style>
