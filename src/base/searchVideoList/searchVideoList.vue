<template>
<scroll class="search-list"
  @scrollToEnd="scrollToEnd"
  :pullup="true">
  <tip ref="tip"></tip>
  <ul class="container">
    <li class="search-item" v-for="(item, index) in searches" :key="index" @click="chooseVideo(index)">
      <img class="videoCover" :style="VideoItemHeightStyle" :src="item.Video.videoCover">
      <div class="bottom">
        <p class="videoDesc">{{`${item.Video.videoDesc.substr(0, 40)}...`}}</p>
        <div class="userAndLike">
          <div class="avatarAndName">
            <img class="avatar" :src="`${baseURL}${item.Video.userAvatar}`" alt="">
            <p class="name">{{item.Video.userNickname}}</p>
          </div>
          <div class="like">
            <span class="iconfont icon-heart"></span>
            <p class="likeNum">{{item.WSLCNum.likeNum}}</p>
          </div>
        </div>
      </div>
    </li>
  </ul>
</scroll>
</template>

<script>
import { baseURL } from 'common/js/config'
import Scroll from 'base/scroll/scroll'
import { mapGetters } from 'vuex'
export default {
  props: {
    searches: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      baseURL
    }
  },
  computed: {
    VideoItemHeightStyle () {
      let clientWidth = document.body.clientWidth
      let height = clientWidth / 2 * 1.3 + 'px'
      return {
        height
      }
    },
    ...mapGetters([
      'loginInfo'
    ])
  },
  methods: {
    scrollToEnd () {
      if (this.searches.length === 0) return
      this.$emit('scrollToEnd')
    },
    chooseVideo (index) {
      this.$emit('chooseVideo', index)
    },
    sliceVideoDesc (str) {
      return `${str.substr(0, 20)}'...'`
    }
  },
  components: {
    Scroll
  }
}
</script>

<style scoped lang='stylus'>
@import '~@/common/stylus/variable'
.search-list
  overflow hidden
  position absolute
  top 88px
  bottom 0
  width 100%
  background $color-background
  .container
    overflow hidden
    .search-item
      position relative
      float left
      width 50%
      .videoCover
        width 100%
      .bottom
        position absolute
        bottom 0
        padding 5px
        display flex
        flex-direction column
        .videoDesc
          font-size $font-size-small-s
          color $color-white
        .userAndLike
          display flex
          justify-content space-between
          .avatarAndName
            display flex
            align-items center
            .avatar
              width 25px
              height 25px
              border-radius 50%
              margin-right 5px
            .name
              font-size $font-size-small-s
              color $color-white
          .like
            display flex
            align-items center
            .icon-heart
              font-size $font-size-small-s
              color $color-white
              margin-right 5px
            .likeNum
              font-size $font-size-small-s
              color $color-white
</style>
