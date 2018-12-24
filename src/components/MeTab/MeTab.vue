<template>
  <div class="tab">
    <router-link tag="div" class="tab-item" to="./video">
      <span class="tab-link">作品 {{videoNum}}</span>
    </router-link>
    <router-link tag="div" class="tab-item" to="./videoAndDesc">
      <span class="tab-link">动态 {{videoNum}}</span>
    </router-link>
    <router-link tag="div" class="tab-item" to="./likes">
      <span class="tab-link">喜欢 {{likeNum}}</span>
    </router-link>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters([
      'videoNum',
      'likeNum'
    ])
  }
}
</script>

<style scoped lang='stylus'>
@import '~@/common/stylus/variable'
.tab
  display flex
  .tab-item
    flex 1
    text-align center
    .tab-link
      display block
      padding 12px
      color $color-desc
    &.router-link-exact-active
      .tab-link
        color $color-white
        border-bottom 2px solid $color-point
</style>
