<template>
<div @click.capture="closeCommentList($event)">
  <scroll class="list-wrap"
    :data="list"
    ref="listWrap"
    :pullup="true"
    @scrollToEnd="fetchVideoList">
    <followed-list :list="list"
      @showCommentList="fetchCommentsAndShowList"></followed-list>
  </scroll>
  <transition name="up">
    <comment-list
      v-if="showCommentList"
      :commentList="commentList"
      :commentNum="commentNum"
      :currentCommentVideoId="currentCommentVideoId"
      @close="closeCommentList"
      @scrollToEnd="fetchCommentsAndShowList"></comment-list>
  </transition>
</div>
</template>

<script>
import Scroll from 'base/scroll/scroll'
import FollowedList from 'components/FollowedList/FollowedList'
import CommentList from 'components/CommentList/CommentList'
import { mapGetters, mapMutations } from 'vuex'
import { deduplicateCommentList } from 'common/js/util'
export default {
  created () {
    this.fetchVideoList()
  },
  activated () {
    if (this.isFirst === false && this.followedNewsNum !== 0) {
      this.videoPage = 0
      this.videoIsEnd = false
      this.fetchVideoList()
    }
    this.isFirst = false
  },
  data () {
    return {
      isFirst: true,
      showCommentList: false,
      commentNum: 0,
      commentList: [],
      videoPage: 0,
      page: 0,
      currentCommentVideoId: '',
      isEnd: false,
      videoIsEnd: false,
      list: []
    }
  },
  computed: {
    ...mapGetters([
      'loginInfo',
      'followedNewsNum'
    ])
  },
  methods: {
    fetchCommentsAndShowList (videoId, commentNum) {
      if (this.currentCommentVideoId !== videoId) {
        this.isEnd = false
        this.page = 1
        this.currentCommentVideoId = videoId
        this.commentNum = commentNum
        this.$axios.get(`/api/video/${videoId}/getVideoComment/page/${this.page}`).then((res) => {
          if (res.data.data.length < 21) {
            this.isEnd = true
          }
          this.commentList = deduplicateCommentList(res.data.data)
          this.showCommentList = true
        })
      } else {
        this.page++
        if (this.isEnd) return
        this.$axios.get(`/api/video/${videoId}/getVideoComment/page/${this.page}`).then((res) => {
          if (res.data.data.length < 21) {
            this.isEnd = true
          }
          this.commentList = deduplicateCommentList(this.commentList.concat(res.data.data))
          this.showCommentList = true
        })
      }
    },
    fetchVideoList () {
      if (this.videoIsEnd) return
      let userId = this.loginInfo.userId
      this.videoPage++
      this.$axios.get(`/api/user/${userId}/FollowerVideo/page/${this.videoPage}`).then((r) => {
        if (r.data.data.length < 21) {
          this.videoIsEnd = true
        }
        this.list = this.list.concat(r.data.data)
      })
    },
    closeCommentList (e) {
      if (this.showCommentList && (e.target.nodeName === 'VIDEO' || e.target.className.includes('icon-close') || e.target.className.includes('followed-item'))) {
        this.currentCommentVideoId = ''
        e.stopPropagation()
        this.showCommentList = false
      }
    },
    ...mapMutations([
      'SET_FOLLOWEDNEWSNUM'
    ])
  },
  beforeRouteLeave (to, from, next) {
    if (this.followedNewsNum > 0) {
      this.$axios.get(`/api/user/${this.loginInfo.userId}/watchAllFollowedNewVideo`).then(r => {
      if (r.data.code === 200) {
        this.SET_FOLLOWEDNEWSNUM(0)
        next()
      }
      })
    } else {
      next()
    }
  },
  components: {
    Scroll,
    FollowedList,
    CommentList
  }
}
</script>

<style scoped lang='stylus'>
@import '~@/common/stylus/variable'
.up-enter-active, .up-leave-active
  transition all .5s
.up-enter, .up-leave-to
  opacity 0
  transform translateY(100%)
.list-wrap
  overflow hidden
  position absolute
  top 0
  bottom 0
  left 0
  right 0
  margin-top 10px
  margin-bottom 44px
</style>
