<template>
<div @click.capture="closeCommentList($event)">
  <scroll class="list-wrap"
    :data="list"
    ref="listWrap">
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
import { mapGetters } from 'vuex'
import { deduplicateCommentList } from 'common/js/util'
export default {
  created () {
    let userId = this.loginInfo.userId
    this.$axios.get(`/api/user/${userId}/FollowerVideo`).then((r) => {
      this.list = r.data.data
      this.$refs.listWrap.refresh()
      this.isLoading = false
    })
  },
  data () {
    return {
      showCommentList: false,
      commentNum: 0,
      commentList: [],
      page: 0,
      currentCommentVideoId: '',
      isEnd: false,
      list: []
    }
  },
  computed: {
    ...mapGetters([
      'loginInfo'
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
          if (res.data.data.length < 20) {
            this.isEnd = true
          }
          this.commentList = deduplicateCommentList(res.data.data)
          this.showCommentList = true
        })
      } else {
        this.page++
        if (this.isEnd) return
        this.$axios.get(`/api/video/${videoId}/getVideoComment/page/${this.page}`).then((res) => {
          if (res.data.data.length < 20) {
            this.isEnd = true
          }
          this.commentList = deduplicateCommentList(this.commentList.concat(res.data.data))
          this.showCommentList = true
        })
      }
    },
    closeCommentList (e) {
      if (this.showCommentList && (e.target.nodeName === 'VIDEO' || e.target.className.includes('icon-close') || e.target.className.includes('followed-item'))) {
        this.currentCommentVideoId = ''
        e.stopPropagation()
        this.showCommentList = false
      }
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
