<template>
<div class="search-list">
  <ul>
    <li class="search-item" v-for="item in searches" :key="item.id" @click="selectItem(item)">
      <img class="avatar" :src="`${baseURL}${item.userAvatar}`" width="50" height="50">
      <div class="main">
        <span class="name">{{item.userNickname}}</span>
        <span class="desc">{{item.userDesc}}</span>
      </div>
      <span v-if="hasMessageBtn" class="iconfont icon-message" @click.stop="chatWith(item)"></span>
    </li>
  </ul>
</div>
</template>

<script>
import { baseURL } from 'common/js/config'
export default {
  props: {
    searches: {
      type: Array,
      default () {
        return []
      }
    },
    hasMessageBtn: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      baseURL
    }
  },
  methods: {
    selectItem (item) {
      this.$emit('select', item)
    },
    chatWith (item) {
      this.$router.push({ path: `/ChatWith/${item.userId}`, query: { userNickname: item.userNickname, userAvatar: item.userAvatar } })
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
      margin-right 30px
      padding 10px
      font-size $font-size-large
</style>
