<template>
<div class="followed-list">
  <div class="followed-item" v-for="(item, index) in list" :key="item.videoInfo.videoId">
    <div class="top">
      <img class="avatar" :src="`${baseURL}${item.userInfo.userAvatar}`" alt="" width="30" height="30"
        @click="chooseUser(item.userInfo.userId)"> <span class="name">@{{item.userInfo.userNickname}}</span>
    </div>
    <div class="desc">{{item.videoInfo.videoDesc}}</div>
    <div class="video-wrap">
      <video class="video"
        :poster="item.videoInfo.videoCover"
        :src="item.videoInfo.videoPath"
        webkit-playsinline
        playsinline
        x5-video-player-type="h5"
        @click.self="playHandler"></video>
    </div>
    <div class="button-bar">
      <div class="like iconfont icon-heart-fill" :class="{ 'red-heart': likes[index] }" @click="toggleLike(item, index)">
        <span class="likenum">{{item.WSLCNum.likeNum}}</span>
      </div>
      <div class="comment iconfont icon-message" @click.stop="showCommentList(item.videoInfo.videoId, item.WSLCNum.commentNum)">
        <span class="commentnum">{{item.WSLCNum.commentNum}}</span>
      </div>
      <div class="share iconfont icon-share">
        <span class="sharenum">{{item.WSLCNum.shareNum}}</span>
      </div>
    </div>
    <div class="time">{{formatTime(item.videoInfo.createdAt)}}</div>
  </div>
  <no-more class="no-more"></no-more>
</div>
</template>

<script>
import NoMore from 'base/NoMore/NoMore'
import { baseURL } from 'common/js/config'
import { formatTime } from 'common/js/util'
import { mapGetters } from 'vuex'
export default {
  props: {
    list: {
      type: Array,
      required: true
    }
  },
  created () {
    for (let i = 0, len = this.list.length; i < len; i++) {
      this.$axios.get(`/api/user/${this.loginInfo.userId}/isLiked/${this.list[i].videoInfo.videoId}`).then((res) => {
        this.likes[i] = res.data.data
        if (i === len - 1) {
          this.$forceUpdate()
        }
      })
    }
  },
  watch: {
    list (newVal, oldVal) {
      for (let i = oldVal.length, len = newVal.length; i < len; i++) {
        this.$axios.get(`/api/user/${this.loginInfo.userId}/isLiked/${this.list[i].videoInfo.videoId}`).then((res) => {
          this.likes[i] = res.data.data
          if (i === len - 1) {
            this.$forceUpdate()
          }
        })
      }
    }
  },
  data () {
    return {
      likes: [],
      baseURL
    }
  },
  computed: {
    ...mapGetters([
      'loginInfo'
    ])
  },
  methods: {
    showCommentList (videoId, commentNum) {
      this.$emit('showCommentList', videoId, commentNum)
    },
    playHandler (e) {
      const v = e.target
      v.paused ? v.play() : v.pause()
    },
    toggleLike (item, index) {
      this.$axios.get(`/api/user/${this.loginInfo.userId}/triggerLike/${item.videoInfo.videoId}`).then((res) => {
        if (res.data.data.includes('取消')) {
          this.likes[index] = false
          item.WSLCNum.likeNum--
        } else {
          this.likes[index] = true
          item.WSLCNum.likeNum++
        }
        this.likes = [].concat(this.likes)
        this.$socket.emit('sendTriggerLike', {
          fromUserId: this.loginInfo.userId,
          toUserId: item.videoInfo.userId
        })
      })
    },
    chooseUser (userId) {
      if (this.$route.path === '/followed') {
        this.$router.push(`/profile/${userId}`)
      }
    },
    formatTime
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
  .no-more
    margin-top 12px
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
        background #000
        display block
        object-fit contain
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
