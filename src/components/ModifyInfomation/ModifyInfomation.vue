<template>
  <div class="modify-information-wrap">
    <my-header title="编辑个人资料" :hasBack="true" :goBack="goBack"></my-header>
    <div class="content">
      <div class="content-item">
        <img class="avatar" :src="`${baseURL}${loginInfo.userAvatar}`" alt="" width="80" height="80">
        <span class="desc">点击更换头像</span>
      </div>
      <div class="content-item">
        <p>昵称</p><p>{{loginInfo.userNickname}}</p>
      </div>
      <div class="content-item">
        <p>签名</p><p>{{loginInfo.userDesc}}</p>
      </div>
      <div class="content-item">
        <p>性别</p><p>{{loginInfo.userGender}}</p>
      </div>
      <div class="content-item">
        <p>年龄</p><p>{{loginInfo.userAge}}</p>
      </div>
      <div class="content-item">
        <p>地区</p><p>{{loginInfo.userAddress}}</p>
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
    goBack () {
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
      display flex
      padding 10px
      line-height 44px
      height 44px
      justify-content space-between
      &:first-of-type
        height 100%
        line-height 100%
        padding 0 0 20px 0
        flex-direction column
        align-items center
        border-bottom 1px solid $color-divide
      .avatar
        margin 20px 0
      .desc
        font-size $font-size-small
        color $color-desc
</style>
