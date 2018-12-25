<template>
<div class="tab" :class="{ 'tab-transparent': isHome }" v-show="showHomeTab">
  <router-link tag="div" class="tab-item" to="/home">
    <span class="tab-link">首页</span>
  </router-link>
  <router-link tag="div" class="tab-item" to="/followed">
    <span class="tab-link">关注</span>
  </router-link>
  <div class="tab-item">
    <span class="tab-btn">+</span>
  </div>
  <router-link tag="div" class="tab-item" to="/message">
    <span class="tab-link">消息</span>
  </router-link>
  <router-link tag="div" class="tab-item" to="/profile/me">
    <span class="tab-link">我</span>
  </router-link>
</div>
</template>

<script>
export default {
  computed: {
    isHome () {
      return this.$route.name === 'home'
    },
    showHomeTab () {
      const paths = ['/home', '/followed', '/message', '/profile/me/video', '/profile/me/videoAndDesc', '/profile/me/likes']
      const route = this.$route
      for (let i = 0; i < paths.length; i++) {
        if (route.path.indexOf(paths[i]) !== -1) return true
      }
      return false
    }
  }
}
</script>

<style lang='stylus' scoped>
@import '~@/common/stylus/variable'
.tab
  border-top .5px solid $color-divide
  background rgb(26, 27, 32)
  display flex
  height 44px
  line-height 44px
  font-size $font-size-medium
  transition background 0.5s
  .tab-item
    flex 1
    text-align center
    .tab-btn
      font-weight 600
      color #000
      padding 5px 15px
      border-radius 5px
      background #fff
    .tab-link
      padding-bottom 10px
      color $color-desc
    &.router-link-active
      .tab-link
        color $color-white
        border-bottom 2px solid $color-white
.tab-transparent
  background rgba(26, 27, 32, 0)
</style>
