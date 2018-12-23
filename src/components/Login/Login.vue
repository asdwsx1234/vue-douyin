<template>
<div class="login-wrap">
  <i class="iconfont icon-close" @click="close"></i>
  <a class="register" @click="showRegister = true">注册账号</a>
  <div class="form-wrap">
    <h1 class="title">登录</h1>
    <input class="input" type="email" placeholder="输入邮箱" autocomplete="off" name="" id="email">
    <input class="input" type="password" placeholder="输入密码" name="" id="password">
    <a class="forget-password" @click="showRetrievePassword=true">忘记了？找回密码</a>
    <div class="login-btn">
      <i class="iconfont icon-check"></i>
    </div>
  </div>
  <transition name="right-to-left">
    <register
      v-if="showRegister"
      @back="showRegister=false"></register>
      <retrieve-password
      v-if="showRetrievePassword"
      @back="showRetrievePassword=false"></retrieve-password>
  </transition>
</div>
</template>

<script>
import Register from 'components/Register/Register'
import RetrievePassword from 'components/RetrievePassword/RetrievePassword'
export default {
  data () {
    return {
      showRegister: false,
      showRetrievePassword: false
    }
  },
  methods: {
    close () {
      this.$emit('login-close')
    }
  },
  components: {
    Register,
    RetrievePassword
  }
}
</script>

<style scoped lang='stylus'>
@import '~@/common/stylus/variable'
.right-to-left-enter-active, .right-to-left-leave-active
  transition all .5s
.right-to-left-enter, .right-to-left-leave-to
  opacity 0
  transform translateX(100%)
.login-wrap
  position absolute
  top 0
  bottom 0
  left 0
  right 0
  background-image -webkit-gradient(linear, 0% 0%, 0% 100%, from(rgba(107, 75, 171, .7)), to(rgba(191, 9, 219, .85)))
  z-index 255
  display flex
  justify-content center
  align-items center
  .icon-close
    position absolute
    top 20px
    left 20px
    color $color-text
  .register
    position absolute
    top 20px
    right 20px
    color $color-text
  .form-wrap
    display flex
    flex-direction column
    width 70%
    .title
      text-align center
      font-size $font-size-large-x
      margin-bottom 20px
    .input
      height 44px
      color white
      background rgba(255, 255, 255, .3)
      padding-left 10px
      margin-bottom 10px
      border-radius 4px
      caret-color $color-point
      &:focus
        outline none
        border none
      &::placeholder
        color rgb(194, 142, 253)
  .forget-password
    font-size $font-size-small
    text-align center
    color $color-point
  .login-btn
    margin 40px auto 0 auto
    display flex
    justify-content center
    align-items center
    background rgb(210, 151, 253)
    height 44px
    width 44px
    border-radius 50%
    .icon-check
      color rgba(148, 53, 162, .85)
      font-size $font-size-large
      font-weight 700
</style>
