<template>
<div class="register-wrap">
  <i class="iconfont icon-left" @click="back"></i>
  <div class="form-wrap">
    <h1 class="title">注册</h1>
    <input class="input" type="email" placeholder="输入邮箱" autocomplete="off" v-model="email" @keyup="listenBtn($event)" id="email">
    <input class="input" type="password" placeholder="输入密码" v-model="password" id="password">
    <code-input
      :email="email"
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
import axios from 'axios'
import { baseURL } from 'common/js/config'
import { mapActions } from 'vuex'
export default {
  data () {
    return {
      email: '',
      password: '',
      code: ''
    }
  },
  methods: {
    back () {
      this.$emit('back')
    },
    _code (e) {
      this.code = e
    },
    register () {
      let user = {
        email: this.email,
        password: this.password,
        code: this.code
      }
      if (!regEmail.test(user.email)) {
        // tip:email
        return
      }
      if (user.password.length < 6) {
        // tip:password
        return
      }
      axios.post('/api/common/user/register', user, {
        baseURL
      }).then(() => {
        this.loginByPassword(user)
      }).catch((e) => {
        console.log(e)
      })
    },
    listenBtn (e) {
      if (!regEmail.test(this.email)) {
        this.$refs.codeInput.setDisabled(true)
        return
      }
      this.$refs.codeInput.setDisabled(false)
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
