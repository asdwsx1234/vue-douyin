<template>
  <ul class="msg-tab">
    <li class="tab-item">
      <router-link tag="div" to="/message/fan">
        <div class="icon iconfont icon-team"></div>
        <span class="desc">粉丝</span>
      </router-link>
    </li>
    <li class="tab-item">
      <router-link tag="div" to="/message/like">
        <div class="icon iconfont icon-heart"></div>
        <span class="desc">赞</span>
      </router-link>
    </li>
    <li class="tab-item">
      <router-link tag="div" to="/message/at">
        <div class="icon iconfont icon-at"></div>
        <span class="desc">@我的</span>
      </router-link>
    </li>
    <li class="tab-item">
      <router-link tag="div" to="/message/comment">
        <div class="icon iconfont icon-message"></div>
        <span class="desc">评论</span>
      </router-link>
    </li>
  </ul>
</template>

<script>
export default {
  data () {
    return {
      items: [ { id: 1, desc: '粉丝' },
        { id: 2, desc: '赞' },
        { id: 3, desc: '@我的' },
        { id: 4, desc: '评论' }]
    }
  }
}
</script>

<style scoped lang='stylus'>
@import '~@/common/stylus/variable'
.msg-tab
  display flex
  .tab-item
    display flex
    justify-content center
    flex 1
    .icon
      width 40px
      height 40px
      font-size 20px
      display flex
      justify-content center
      align-items center
    .icon-heart
      background rgb(248, 53, 95)
    .icon-team
      background rgb(79, 136, 251)
    .icon-message
      background rgb(167, 83, 236)
    .icon-at
      background rgb(28, 194, 98)
  .tab-item > div
    display flex
    flex-direction column
    .desc
      margin-top 5px
      color $color-text
      font-size $font-size-small
      text-align center
</style>
