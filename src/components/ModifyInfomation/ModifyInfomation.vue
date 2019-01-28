<template>
  <div class="modify-information-wrap">
    <confirm :text="'是否保存修改'"
      @confirm="confirm"
      @cancel="cancel"
      ref="confirm"></confirm>
    <my-header title="编辑个人资料" :hasBack="true" :goBack="goBack"></my-header>
    <div class="content">
      <div class="content-item">
        <avatar-cropper :avatarImage="avatarUrl"
        @getAvatarImage="getAvatarImage"></avatar-cropper>
      </div>
      <div class="content-item">
        <p>昵称</p><input class="input" type="text" name="nickname" id="nickname" :value="loginInfo.userNickname" @blur="inputBlur">
      </div>
      <div class="content-item">
        <p>签名</p><input class="input" type="text" name="desc" id="desc" :value="loginInfo.userDesc" @blur="inputBlur">
      </div>
      <div class="content-item">
        <p>性别</p><select class="input" name="gender" id="gender" :value="loginInfo.userGender === '男' ? 1 : 0">
                    <option value="1">男</option>
                    <option value="0">女</option></select>
      </div>
      <div class="content-item">
        <p>年龄</p><input class="input number-input" type="number" name="age" id="age" min="1" max="150" :value="loginInfo.userAge" @blur="inputBlur"/>
      </div>
      <div class="content-item">
        <p>地区</p><input class="input" type="text" name="address" id="address" :value="loginInfo.userAddress" @blur="inputBlur">
      </div>
    </div>
  </div>
</template>

<script>
import MyHeader from 'components/MyHeader/MyHeader'
import AvatarCropper from 'components/AvatarCropper/AvatarCropper'
import Confirm from 'base/confirm/confirm'
import { baseURL } from 'common/js/config'
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      baseURL,
      avatarUrl: '',
      isChanged: false,
      avatarIsChanged: false,
      userInfo: {}
    }
  },
  mounted () {
    this.avatarUrl = `${this.baseURL}${this.loginInfo.userAvatar}?v=${Math.random()}`
  },
  computed: {
    ...mapGetters([
      'loginInfo'
    ])
  },
  methods: {
    getAvatarImage (url) {
      this.avatarUrl = url
      this.avatarIsChanged = true
    },
    inputBlur () {
      window.scroll(0, 0)
    },
    async goBack () {
      let age = document.getElementById('age')
      let desc = document.getElementById('desc')
      let gender = document.getElementById('gender')
      let address = document.getElementById('address')
      let nickname = document.getElementById('nickname')
      this.userInfo = {
        userNickname: nickname.value,
        userDesc: desc.value,
        userGender: gender.value === '1' ? '男' : '女',
        userAge: age.value,
        userAddress: address.value
      }
      for (let key in this.userInfo) {
        if (this.userInfo[key] !== String(this.loginInfo[key])) {
          this.isChanged = true
          break
        }
      }
      if (this.isChanged || this.avatarIsChanged) {
        this.$refs.confirm.show()
      } else {
        this.$emit('closeModifyInfomation')
      }
    },
    async confirm () {
      if (this.avatarIsChanged) {
        let r = await this.$axios.post(`/api/user/${this.loginInfo.userId}/uploadAvatar`, {
          fieldName: this.avatarUrl
        })
        this.userInfo.userAvatar = `/assets/avatar/${this.loginInfo.userId}.png`
        if (r.status === 200) await this.$axios.post(`/api/user/${this.loginInfo.userId}/modifyUserInfo`, this.userInfo)
      } else {
        await this.$axios.post(`/api/user/${this.loginInfo.userId}/modifyUserInfo`, this.userInfo)
      }
      this.$store.dispatch('persistentConnection')
      this.$emit('InfomationChanged', this.userInfo)
      this.$emit('closeModifyInfomation')
    },
    cancel () {
      this.avatarUrl = `${this.baseURL}${this.loginInfo.userAvatar}`
      this.$emit('closeModifyInfomation')
    }
  },
  components: {
    MyHeader,
    AvatarCropper,
    Confirm
  }
}
</script>

<style scoped lang='stylus'>
@import '~@/common/stylus/variable'
.modify-information-wrap
  position absolute
  z-index 9999
  left 0
  right 0
  top 0
  bottom 0
  background $color-background
  .content
    display flex
    flex-direction column
    .content-item
      position relative
      display flex
      padding 10px 20px
      line-height 44px
      height 44px
      justify-content space-between
      .input
        background $color-background
        color $color-text
        text-align right
      &:first-of-type
        height 100%
        line-height 100%
        padding 0 0 20px 0
        flex-direction column
        align-items center
        border-bottom 1px solid $color-divide
</style>
