<template>
  <div class="modify-information-wrap">
    <my-header title="编辑个人资料" :hasBack="true" :goBack="goBack"></my-header>
    <div class="content">
      <div class="content-item">
        <img class="avatar" :src="`${baseURL}${loginInfo.userAvatar}`" alt="" width="100" height="100" ref="avatar">
        <span class="desc">点击更换头像</span>
        <input class="img-input" type="file" accept="image/*" id="avatar" @change="imgChange">
      </div>
      <div class="content-item">
        <p>昵称</p><input class="input" type="text" name="nickname" id="nickname" :value="loginInfo.userNickname">
      </div>
      <div class="content-item">
        <p>签名</p><input class="input" type="text" name="desc" id="desc" :value="loginInfo.userDesc">
      </div>
      <div class="content-item">
        <p>性别</p><select class="input" name="gender" id="gender" :value="loginInfo.userGender === '男' ? 1 : 0">
                    <option value="1">男</option>
                    <option value="0">女</option></select>
      </div>
      <div class="content-item">
        <p>年龄</p><input class="input number-input" type="number" name="age" id="age" min="1" max="150" :value="loginInfo.userAge"/>
      </div>
      <div class="content-item">
        <p>地区</p><input class="input" type="text" name="address" id="address" :value="loginInfo.userAddress">
      </div>
    </div>
  </div>
</template>

<script>
import MyHeader from 'components/MyHeader/MyHeader'
import { baseURL } from 'common/js/config'
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      baseURL
    }
  },
  computed: {
    ...mapGetters([
      'loginInfo'
    ])
  },
  methods: {
    imgChange () {
      console.log(this)
    },
    goBack () {
      let age = document.getElementById('age')
      let desc = document.getElementById('desc')
      let gender = document.getElementById('gender')
      let address = document.getElementById('address')
      let nickname = document.getElementById('nickname')
      let userInfo = {
        nickname: nickname.value,
        desc: desc.value,
        gender: gender.value === '1' ? '男' : '女',
        age: age.value,
        address: address.value
      }
      console.log(userInfo)
      this.$emit('closeModifyInfomation')
    }
  },
  components: {
    MyHeader
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
      .img-input
        position absolute
        opacity 0
        top 20px
        width 100px
        height 140px
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
      .avatar
        margin 20px 0
        border-radius 50%
      .desc
        font-size $font-size-small
        color $color-desc
</style>
