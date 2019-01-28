<template>
<div class="retrieve-wrap">
  <i class="iconfont icon-left" @click="back"></i>
  <div class="form-wrap">
    <h1 class="title">找回密码</h1>
    <p class="tip">输入<i class="email">{{email}}</i>收到的6位验证码</p>
    <code-input
      :email="email"
      ref="codeInput"
      @code-tip="_emitTip"
      @code="_code"></code-input>
    <input class="input" type="password" v-model="password" placeholder="输入新密码" id="password" @blur="inputBlur">
    <div class="login-btn" @click="retrievePassword">
      <i class="iconfont icon-check"></i>
    </div>
  </div>
</div>
</template>

<script>
import CodeInput from 'base/CodeInput/CodeInput'
export default {
  props: {
    email: {
      type: String,
      required: true
    }
  },
  mounted () {
    this.$refs.codeInput.setDisabled(false)
    this.$refs.codeInput.getCode()
  },
  data () {
    return {
      code: '',
      password: ''
    }
  },
  methods: {
    back () {
      this.$emit('back')
    },
    _code (e) {
      this.code = e
    },
    _emitTip (message) {
      this.$emit('retrieve-tip', message)
    },
    retrievePassword () {
      let user = {
        email: this.email,
        password: this.password,
        code: this.code
      }
      if (this.password.length < 6 || this.code.length !== 6) return
      this.$axios.post('/api/common/user/retrievePassword', user).then(() => {
        this.back()
      }).catch((e) => {
        this._emitTip('验证码错误')
      })
    },
    inputBlur () {
      window.scroll(0, 0)
    }
  },
  components: {
    CodeInput
  }
}
</script>

<style scoped lang='stylus'>
@import '~@/common/stylus/variable'
.retrieve-wrap
  position absolute
  top 0
  bottom 0
  left 0
  right 0
  background-image -webkit-gradient(linear, 0% 0%, 0% 100%, from(rgb(107, 75, 171)), to(rgb(191, 9, 219)))
  z-index 255
  display flex
  justify-content center
  align-items center
  .icon-left
    position absolute
    top 20px
    left 20px
    color $color-text
  .form-wrap
    display flex
    flex-direction column
    width 70%
    .title
      text-align center
      font-size $font-size-large-x
      margin-bottom 20px
    .tip
      font-size $font-size-small
      margin-bottom 20px
      text-align center
      .email
        color $color-point
    .input
      margin-top 10px
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
