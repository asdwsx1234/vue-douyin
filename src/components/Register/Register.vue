<template>
<div class="register-wrap">
  <i class="iconfont icon-left" @click="back"></i>
  <div class="form-wrap">
    <h1 class="title">注册</h1>
    <input class="input" type="email" placeholder="输入邮箱" autocomplete="off" v-model="email" @blur="inputBlur" id="email">
    <input class="input" type="password" placeholder="输入密码" v-model="password" @blur="inputBlur" id="password">
    <code-input
      :email="email"
      @code-tip="_emitTip"
      ref="codeInput"
      @code="_code"></code-input>
    <div class="login-btn" @click="register">
      <i class="iconfont icon-check"></i>
    </div>
  </div>
</div>
</template>

<script>
import { regEmail } from 'common/js/util'
import CodeInput from 'base/CodeInput/CodeInput'
import { mapActions } from 'vuex'
export default {
  data () {
    return {
      email: '',
      password: '',
      code: ''
    }
  },
  watch: {
    email (newVal) {
      if (!regEmail.test(newVal)) {
        this.$refs.codeInput.setDisabled(true)
        return
      }
      this.$refs.codeInput.setDisabled(false)
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
      this.$emit('register-tip', message)
    },
    register () {
      let user = {
        email: this.email,
        password: this.password,
        code: this.code
      }
      if (!regEmail.test(user.email)) {
        this._emitTip('请输入正确的邮箱！')
        return
      }
      if (user.password.length < 6) {
        this._emitTip('密码至少需要6位！')
        return
      }
      if (user.code.length !== 6) {
        this._emitTip('验证码需要6位！')
        return
      }
      this.$axios.post('/api/common/user/register', user).then((r) => {
        if (r.data.data.message === '验证码错误') {
          this._emitTip('验证码错误！')
          return
        }
        this.loginByPassword(user)
      }).catch((e) => {
        this._emitTip('邮箱已被注册！')
      })
    },
    inputBlur () {
      window.scroll(0, 0)
    },
    ...mapActions([
      'loginByPassword'
    ])
  },
  components: {
    CodeInput
  }
}
</script>

<style scoped lang='stylus'>
@import '~@/common/stylus/variable'
.register-wrap
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
