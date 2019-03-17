<template>
<div class="row">
  <input class="input" type="text" id="code" @keyup="codeInput($event.target.value)" @blur="inputBlur" placeholder="输入邮箱验证码">
  <div class="code-btn" :class="{'btn-active': !disabled }" @click="getCode" ref="codeBtn">获取验证码</div>
</div>
</template>

<script>
export default {
  props: {
    email: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      cutdown: 60,
      disabled: true
    }
  },
  methods: {
    setDisabled (flag) {
      this.disabled = flag
    },
    codeInput (e) {
      this.$emit('code', e)
    },
    getCode () {
      if (this.disabled) return
      this.setDisabled(true)
      this.$axios.get(`/api/common/user/getCode/${this.email}`).then(() => {
        this.cutdownMethod()
      }).catch((e) => {
        this.setDisabled(false)
        this.$emit('code-tip', '验证码发送失败')
      })
    },
    inputBlur () {
      window.scroll(0, 0)
    },
    cutdownMethod () {
      if (this.cutdown === 0) {
        this.cutdown = 60
        this.$refs.codeBtn.innerHTML = '获取验证码'
        this.setDisabled(false)
      } else {
        this.$refs.codeBtn.innerHTML = this.cutdown
        this.cutdown--
        setTimeout(() => {
          this.cutdownMethod()
        }, 1000)
      }
    }
  }
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
    width 150px
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
    transition all 1s
  .btn-active
    color #fff
    background rgba(255, 255, 255, .5)
</style>
