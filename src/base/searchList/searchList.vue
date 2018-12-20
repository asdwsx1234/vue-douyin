<template>
<div class="search-list">
  <ul>
    <li class="search-item" v-for="item in searches" :key="item.id">
      <img class="avatar" src="./1.jpg" width="50" height="50">
      <div class="main">
        <span class="name">{{item.name}}</span>
        <span class="desc">懒得填写个性签名</span>
      </div>
      <span class="iconfont icon-message"></span>
    </li>
  </ul>
</div>
</template>

<script>
export default {
  props: {
    searches: {
      type: Array,
      default () {
        return []
      }
    }
  }
}
</script>

<style scoped lang='stylus'>
@import '~@/common/stylus/variable'
.search-list
  background $color-background
  .search-item
    display flex
    align-items center
    padding 0 0 20px 20px
    .avatar
      border-radius 50%
    .main
      flex 1
      display flex
      flex-direction column
      margin-left 10px
      .name
        color $color-text
        font-size $font-size-medium
      .desc
        margin-top 10px
        color $color-desc
        font-size $font-size-small
    .icon-message
      margin-right 40px
      font-size $font-size-large
</style>
