<template>
<div class="followed-list">
  <div class="followed-item" v-for="item in list" :key="item.id">
    <div class="top">
      <img class="avatar" src="./logo.png" alt="" width="30" height="30"
        @click="chooseUser"> <span class="name">@{{item.name}}</span>
    </div>
    <div class="desc">{{item.desc}}</div>
    <div class="video-wrap">
      <video class="video"
        :src="item.video"
        webkit-playsinline
        playsinline
        x5-video-player-type="h5"
        @click.self="playHandler"></video>
    </div>
    <div class="button-bar">
      <div class="like iconfont icon-heart-fill" :class="{ 'red-heart': like }" @click="toggleLike">
        <span class="likenum">4.1w</span>
      </div>
      <div class="comment iconfont icon-message" @click.stop="showCommentList">
        <span class="commentnum">667</span>
      </div>
      <div class="share iconfont icon-share">
        <span class="sharenum">4765</span>
      </div>
    </div>
    <div class="time">{{item.time}}</div>
  </div>
  <no-more></no-more>
</div>
</template>

<script>
import NoMore from 'base/NoMore/NoMore'
export default {
  props: {
    list: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      like: false
    }
  },
  methods: {
    showCommentList () {
      this.$emit('showCommentList')
    },
    playHandler (e) {
      const v = e.target
      v.paused ? v.play() : v.pause()
    },
    toggleLike () {
      this.like = !this.like
    },
    chooseUser () {
      if (this.$route.path === '/followed') {
        this.$router.push('/profile/456')
      }
    }
  },
  components: {
    NoMore
  }
}
</script>

<style scoped lang='stylus'>
@import '~@/common/stylus/variable'
.followed-list
  margin 10px 10px 0 10px
  .followed-item
    margin-top 10px
    display flex
    flex-direction column
    border-bottom 1px solid $color-divide
    &:nth-last-child(2)
      border none
    .top
      .name
        color $color-white
        margin-left 5px
        vertical-align top
        line-height 32px
        font-size $font-size-medium
      .avatar
        border-radius 50%
    .desc
      font-size $font-size-medium
      margin 10px 0
      color $color-text
    .video-wrap
      position relative
      width 70%
      height 400px
      .video
        display block
        object-fit cover
        width 100%
        height 100%
        border-radius 5px
    .button-bar
      margin 10px 0
      display flex
      width 50%
      justify-content space-between
      .like
        position relative
        .likenum
          font-size $font-size-small-s
          position absolute
          left 100%
          top 50%
          transform translateX(20%) translateY(-50%)
          color $color-text
      .red-heart
        color rgb(248, 53, 95)
      .comment
        position relative
        .commentnum
          font-size $font-size-small-s
          position absolute
          left 100%
          top 50%
          transform translateX(20%) translateY(-50%)
      .share
        position relative
        .sharenum
          font-size $font-size-small-s
          position absolute
          left 100%
          top 50%
          transform translateX(20%) translateY(-50%)
    .button-bar > div
      width 26px
      height 26px
      font-size 26px
      color $color-btn
      transition color .3s
    .time
      margin-bottom 20px
      color $color-desc
      font-size $font-size-small-s
</style>
