<template>
<div @click.capture="closeCommentList($event)">
  <div class="back iconfont icon-left" @click="close"></div>
  <scroll class="wrap"
    ref="scroll"
    :probeType="3"
    :data="playList"
    :scrollEnd="true"
    :momentum="false"
    @scrollEnd="scrollEnd">
    <div>
      <my-video v-for="item in playList"
        :key="item.id"
        :VideoItem="item"
        @showCommentList="fetchCommentsAndShowList"></my-video>
    </div>
  </scroll>
  <transition name="up">
    <comment-list
      v-if="showCommentList"
      :commentList="commentList"
      :commentNum="commentNum"
      @close="closeCommentList"
      @scrollToEnd="fetchCommentsAndShowList"></comment-list>
  </transition>
</div>
</template>

<script>
import Scroll from 'base/scroll/scroll'
import MyVideo from 'components/MyVideo/MyVideo'
import CommentList from 'components/CommentList/CommentList'
import { mapGetters, mapActions } from 'vuex'
import { baseURL } from 'common/js/config'
import axios from 'axios'
export default {
  data () {
    return {
      currentY: 0,
      showCommentList: false,
      commentNum: 0,
      commentList: [],
      page: 0,
      currentCommentVideoId: '',
      isEnd: false
    }
  },
  methods: {
    scrollEnd (pos) {
      let clientHeight = this.clientHeight
      if (Math.abs(pos.y) < this.currentY - clientHeight / 2) { // 上一页
        this.currentY -= clientHeight
        this.$refs.scroll.scrollTo(0, -this.currentY)
      }
      if (Math.abs(pos.y) < this.currentY + clientHeight / 2) { // 本页
        this.$refs.scroll.scrollTo(0, -this.currentY)
      } else {
        this.currentY += clientHeight
        this.$refs.scroll.scrollTo(0, -this.currentY) // 下一页
      }
    },
    fetchCommentsAndShowList (videoId, commentNum) {
      if (!this.isLogged) this.showLoginWrap = true
      if (this.currentCommentVideoId !== videoId) {
        this.isEnd = false
        this.page = 1
        this.currentCommentVideoId = videoId
        this.commentNum = commentNum
        axios.get(`/api/video/${videoId}/getVideoComment/page/${this.page}`, {
          baseURL,
          withCredentials: true
        }).then((res) => {
          if (res.data.data.length < 20) {
            this.isEnd = true
          }
          this.commentList = res.data.data
          this.showCommentList = true
        })
      } else {
        this.page++
        if (this.isEnd) return
        axios.get(`/api/video/${videoId}/getVideoComment/page/${this.page}`, {
          baseURL,
          withCredentials: true
        }).then((res) => {
          if (res.data.data.length < 20) {
            this.isEnd = true
          }
          this.commentList = this.commentList.concat(res.data.data)
          this.showCommentList = true
        })
      }
    },
    scrollToIndex (index) {
      this.currentY = index * this.clientHeight
      this.$refs.scroll.scrollTo(0, -this.currentY)
    },
    close () {
      this.$emit('close')
    },
    closeCommentList (e) {
      if (this.showCommentList) {
        e.stopPropagation()
        this.showCommentList = false
      }
    },
    ...mapActions([
      'getPopularVideo'
    ])
  },
  computed: {
    clientHeight () {
      return document.body.clientHeight
    },
    ...mapGetters([
      'playList'
    ])
  },
  components: {
    MyVideo,
    Scroll,
    CommentList
  }
}
</script>

<style scoped lang='stylus'>
.up-enter-active, .up-leave-active
  transition all .5s
.up-enter, .up-leave-to
  opacity 0
  transform translateY(100%)
.wrap
  position relative
  height 100vh
  width 100vw
.back
  position absolute
  left 10px
  top 10px
  padding 8px
  z-index 33
</style>
