<template>
  <div class="comment-list">
    <div class="top">
      {{commentNum}}条评论
      <span class="iconfont icon-close" @click.stop="close($event)"></span>
    </div>
    <scroll
      @click.stop.native
      class="comment-item-wrap"
      :data="commentList"
      :pullup="true"
      @scrollToEnd="scrollToEnd">
      <div>
        <div class="comment-item" v-for="(item, index) in commentList" :key="index">
          <img class="avatar" :src="`${baseURL}${item.userInfo.userAvatar}`" alt="" width="40" height="40">
          <div class="main">
            <p class="name">@{{item.userInfo.userNickname}}</p>
            <p class="content">{{item.Comment.commentContent}}</p>
            <p class="time">{{formatTime(item.Comment.createdAt)}}</p>
          </div>
          <div class="like" :class="{ 'red-heart': likes[index] }" @click.stop="toggleLike(index)">
            <i class="iconfont icon-heart-fill"></i>
            <p class="like-desc">{{item.likeNum}}</p>
          </div>
        </div>
        <no-more></no-more>
      </div>
    </scroll>
    <div class="input-bar">
      <input class="input" placeholder="  有爱评论，说点儿好听的~" type="text">
      <span class="iconfont icon-at"></span>
      <span class="iconfont icon-at"></span>
    </div>
  </div>
</template>

<script>
import Scroll from 'base/scroll/scroll'
import NoMore from 'base/NoMore/NoMore'
import { formatTime } from 'common/js/util'
import { baseURL } from 'common/js/config'
export default {
  props: {
    commentList: {
      type: Array,
      required: true
    },
    commentNum: {
      type: String,
      required: true
    }
  },
  mounted () {
    let length = this.commentList.length
    for (let i = 0; i < length; i++) {
      this.likes[i] = false
    }
  },
  data () {
    return {
      likes: [],
      baseURL
    }
  },
  methods: {
    close (e) {
      this.$emit('close', e)
    },
    toggleLike (index) {
      this.likes[index] = !this.likes[index]
      this.likes = [].concat(this.likes)
    },
    scrollToEnd () {
      if (this.commentList.length > 0) {
        this.$emit('scrollToEnd', this.commentList[0].Comment.videoId)
      }
    },
    formatTime
  },
  components: {
    Scroll,
    NoMore
  }
}
</script>

<style scoped lang='stylus'>
@import '~@/common/stylus/variable'
.comment-list
  position fixed
  bottom 0
  height 70%
  width 100%
  background $color-background-a
  border-top-left-radius 8px
  border-top-right-radius 8px
  z-index 255
  .top
    position relative
    text-align center
    padding 10px 0
    color $color-title
    font-size $font-size-small
    font-weight 600
    .icon-close
      position absolute
      right 10px
  .comment-item-wrap
    position absolute
    top 32px
    bottom 44px
    overflow hidden
    width 100%
  .comment-item
    display flex
    padding 0 0 0 10px
    &:nth-last-child(2)
      .main
        border-bottom none
    .avatar
      margin-top 10px
      border-radius 50%
    .main
      padding 10px
      flex 1
      border-bottom 1px solid $color-divide
      .name
        color rgb(166, 165 ,164)
        font-size $font-size-small
      .content
        padding 5px 0
        color $color-text
        font-size $font-size-medium
      .time
        color $color-title
        font-size $font-size-small
    .like
      width 44px
      display flex
      flex-direction column
      justify-content center
      align-items center
      color rgb(80, 80, 82)
      .icon-heart-fill
        font-size $font-size-large
        transition color .3s
      .like-desc
        margin-top 5px
        font-size $font-size-small
    .red-heart
      color rgb(248, 53, 95)
  .input-bar
    width 100%
    display flex
    height 44px
    position absolute
    bottom 0
    background rgb(26, 27, 32)
    .input
      background rgb(26, 27, 32)
      flex 1
      font-size $font-size-medium
      color $color-text
      padding-left 10px
      &:focus
        outline none
        border none
    .iconfont
      display flex
      justify-content center
      align-items center
      width 44px
</style>
