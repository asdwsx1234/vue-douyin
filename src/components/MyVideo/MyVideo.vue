<template>
  <div class="my-video">
    <video class="video" :src="VideoItem.videoInfo.videoPath"
      webkit-playsinline
      playsinline
      x5-video-player-type="h5"
      @click="playHandler"
      ref="video"></video>
    <div class="side-bar">
      <div class="avatar">
        <img :src="`${baseURL}${VideoItem.userInfo.userAvatar}`" alt="" width="40" height="40"
          @click="chooseUser">
        <div class="follow">+</div>
      </div>
      <div class="like iconfont icon-heart-fill" :class="{ 'red-heart': like }" @click="toggleLike">
        <span class="likenum">{{VideoItem.likeNum}}</span>
      </div>
      <div class="comment iconfont icon-message" @click.stop="showCommentList">
        <span class="commentnum">{{VideoItem.commentNum}}</span>
      </div>
      <div class="share iconfont icon-share">
        <span class="sharenum">{{VideoItem.shareNum}}</span>
      </div>
    </div>
    <div class="text-wrap">
      <div class="name">@{{VideoItem.userInfo.userNickname}}</div>
      <div class="desc">{{VideoItem.videoInfo.videoDesc}}</div>
    </div>
    <div class="input-bar" v-show="!isHome">
      <input class="input" placeholder="  有爱评论，说点儿好听的~" type="text">
      <span class="iconfont icon-at"></span>
      <span class="iconfont icon-at"></span>
    </div>
  </div>
</template>

<script>
import { baseURL } from 'common/js/config'
export default {
  props: {
    VideoItem: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      baseURL,
      like: false
    }
  },
  computed: {
    isHome () {
      return this.$route.name === 'home'
    }
  },
  methods: {
    playHandler () {
      const v = this.$refs.video
      v.paused ? v.play() : v.pause()
    },
    showCommentList () {
      this.$emit('showCommentList')
    },
    toggleLike () {
      this.like = !this.like
    },
    chooseUser () {
      this.$router.push(`/profile/${this.VideoItem.videoInfo.userId}`)
    }
  },
  components: {
  }
}
</script>

<style scoped lang='stylus'>
@import '~@/common/stylus/variable'
.my-video
  position relative
  height 100vh
  width 100vw
  .input-bar
    border-top .5px solid $color-divide
    width 100%
    display flex
    height 44px
    position absolute
    bottom 0
    background rgba(26, 27, 32, 0)
    .input
      background rgba(26, 27, 32, 0)
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
  .video
    display block
    width 100%
    height 100%
  .text-wrap
    position absolute
    left 10px
    bottom 54px
    width 70%
    .name
      color $color-white
      margin-bottom 10px
    .desc
      font-size $font-size-medium
      color $color-text
  .side-bar
    position absolute
    right 10px
    bottom 74px
    display flex
    flex-direction column
    height 250px
    justify-content space-between
    .avatar
      position relative
      border-radius 50%
      background none
      border 1px solid $color-text
      img
        border-radius 50%
      .follow
        text-align center
        position absolute
        bottom 0
        left 50%
        transform translateX(-50%) translateY(50%)
        width 16px
        height 16px
        font-size 16px
        border-radius 50%
        background rgb(252, 52, 93)
    .like
      position relative
      .likenum
        font-size $font-size-small-s
        position absolute
        bottom -5px
        left 50%
        transform translateX(-50%) translateY(100%)
        color $color-text
    .red-heart
      color rgb(248, 53, 95)
    .comment
      position relative
      .commentnum
        font-size $font-size-small-s
        position absolute
        bottom -5px
        left 50%
        transform translateX(-50%) translateY(100%)
        color $color-text
    .share
      position relative
      .sharenum
        font-size $font-size-small-s
        position absolute
        bottom -5px
        left 50%
        transform translateX(-50%) translateY(100%)
        color $color-text
  .side-bar > div
    width 40px
    height 40px
    font-size 40px
    color $color-text
    transition color .3s
</style>
