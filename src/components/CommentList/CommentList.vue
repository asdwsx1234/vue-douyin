<template>
  <div class="comment-list">
    <div class="top">
      {{commentNum}}条评论
      <span class="iconfont icon-close" @click.stop="close($event)"></span>
    </div>
    <scroll
      @click.stop.native
      class="comment-item-wrap"
      :data="acommentList"
      :pullup="true"
      @scrollToEnd="scrollToEnd">
      <div>
        <div class="comment-item" v-for="(item, index) in acommentList" :key="index"
          @touchstart="touchstart(item)"
          @touchmove="touchmove"
          @touchend="touchend">
          <img class="avatar" :src="`${baseURL}${item.Comment.userAvatar}`" alt="" width="40" height="40">
          <div class="main">
            <p class="name">@{{item.Comment.userNickname}}</p>
            <p class="content" v-if="item.replyComment">{{`${item.Comment.commentContent}//@${item.replyComment.userNickname}:${item.replyComment.commentContent}`}}</p>
            <p class="content" v-else>{{item.Comment.commentContent}}</p>
            <p class="time">{{formatTime(item.Comment.createdAt)}}</p>
          </div>
          <div class="like" :class="{ 'red-heart': likes[index] }" @click.stop="toggleLike(item, index)">
            <i class="iconfont icon-heart-fill"></i>
            <p class="like-desc">{{item.likeNum}}</p>
          </div>
        </div>
        <no-more></no-more>
      </div>
    </scroll>
    <div class="input-bar">
      <input class="input" :placeholder="placeholder" v-model="commentContent" type="text">
      <span class="iconfont icon-at" @click="AtFriend"></span>
      <span class="iconfont icon-check" @click="sendComment"></span>
    </div>
    <at-list ref="atList" @chooseUser="chooseUser"></at-list>
  </div>
</template>

<script>
import Scroll from 'base/scroll/scroll'
import NoMore from 'base/NoMore/NoMore'
import AtList from 'components/AtList/AtList'
import { formatTime } from 'common/js/util'
import { baseURL } from 'common/js/config'
import { mapGetters } from 'vuex'
export default {
  props: {
    commentList: {
      type: Array,
      required: true
    },
    commentNum: {
      type: String,
      required: true
    },
    currentCommentVideoId: {
      type: String,
      required: true
    }
  },
  created () {
    for (let i = 0, len = this.commentList.length; i < len; i++) {
      this.$axios.get(`/api/user/${this.loginInfo.userId}/isLikedComment/${this.commentList[i].Comment.commentId}`).then((res) => {
        this.likes[i] = res.data.data
        if (i === len - 1) {
          this.$forceUpdate()
        }
      })
    }
  },
  watch: {
    commentList (newVal, oldVal) {
      this.acommentList = newVal
      for (let i = oldVal.length, len = newVal.length; i < len; i++) {
        this.$axios.get(`/api/user/${this.loginInfo.userId}/isLikedComment/${this.commentList[i].Comment.commentId}`).then((res) => {
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
      atIdList: [],
      atUserList: [],
      acommentList: this.commentList,
      commentContent: '',
      timer: null,
      replyId: '',
      placeholder: '  有爱评论，说点儿好听的~（长按评论回复）',
      baseURL
    }
  },
  computed: {
    ...mapGetters([
      'loginInfo'
    ])
  },
  methods: {
    close (e) {
      this.$emit('close', e)
    },
    chooseUser (item) {
      this.$refs.atList.hide()
      for (let value of this.atUserList) {
        if (value.userId === item.userId) return
      }
      this.commentContent = this.commentContent.concat(`@${item.userNickname}.`)
      this.atUserList.push(item)
    },
    toggleLike (item, index) {
      this.$axios.get(`/api/user/${this.loginInfo.userId}/triggerLikeComment/${item.Comment.videoId}/${item.Comment.commentId}`).then((res) => {
        if (res.data.data.includes('取消')) {
          this.likes[index] = false
          item.likeNum--
        } else {
          this.likes[index] = true
          item.likeNum++
        }
        this.likes = [].concat(this.likes)
        this.$socket.emit('sendTriggerLike', {
          fromUserId: this.loginInfo.userId,
          toUserId: item.Comment.userId
        })
      })
    },
    scrollToEnd () {
      if (this.commentList.length > 0) {
        this.$emit('scrollToEnd', this.commentList[0].Comment.videoId)
      }
    },
    sendComment () {
      let usernickList = this.commentContent.match(/@(.+?)\./g)
      usernickList.forEach((item, index, arr) => {
        let temp = arr[index]
        arr[index] = temp.substr(1, temp.length - 2)
      })
      for (let i = 0, len = usernickList.length; i < len; i++) {
        for (let user of this.atUserList) {
          if (user.userNickname === usernickList[i]) {
            this.atIdList.push(user.userId)
            break
          }
        }
      }

      let cc = this.commentContent.trim()
      if (cc) {
        let comment = {
          fromUserId: this.loginInfo.userId,
          replyId: this.replyId,
          content: cc,
          toVideoId: this.currentCommentVideoId
        }
        this.$axios.post(`/api/user/commentVideo`, comment).then(res => {
          let mycomment = {
            Comment: res.data.data,
            likeNum: 0
          }
          if (this.atIdList.length > 0) {
            this.$axios.post(`/api/user/${this.loginInfo.userId}/AtUser`, {
              userIdStr: this.atIdList.join(','),
              videoId: this.currentCommentVideoId,
              commentId: mycomment.Comment.commentId
            }).then(r => {
              for (let i = 0, len = this.atIdList.length; i < len; i++) {
                this.$socket.emit('sendAt', {
                  fromUserId: this.loginInfo.userId,
                  toUserId: this.atIdList[i]
                })
              }
            })
          }
          mycomment.Comment.userAvatar = this.loginInfo.userAvatar
          mycomment.Comment.userNickname = this.loginInfo.userNickname
          this.commentContent = ''
          this.atIdList = []
          this.atUserList = []
          this.acommentList = [mycomment].concat(this.acommentList)
          this.likes = [false].concat(this.likes)
          this.$socket.emit('sendComment', {
            toVideoId: comment.toVideoId,
            replyId: comment.replyId
          })
        })
      }
    },
    AtFriend () {
      this.$refs.atList.show()
    },
    touchstart (item) {
      this.replyId = ''
      this.placeholder = '  有爱评论，说点儿好听的~（长按评论回复）'
      this.timer = setTimeout(() => {
        this.replyId = item.Comment.commentId
        this.placeholder = `  回复@${item.Comment.userNickname}`
      }, 1000)
    },
    touchmove (e) {
      clearTimeout(this.timer)
    },
    touchend (e) {
      clearTimeout(this.timer)
    },
    formatTime
  },
  components: {
    Scroll,
    NoMore,
    AtList
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
      caret-color $color-point
      &:focus
        outline none
        border none
    .iconfont
      display flex
      justify-content center
      align-items center
      width 44px
</style>
