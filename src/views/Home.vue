<template>
<div class="wrap" @click.capture="closeCommentList($event)">
  <tip ref="tip"></tip>
  <scroll class="scroll-wrap"
    ref="scroll"
    :probeType="3"
    :data="popularVideo"
    :scrollEnd="true"
    :momentum="false"
    @scrollEnd="scrollEnd">
    <div>
      <my-video v-for="item in popularVideo"
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
  <transition name="up">
    <login
      v-if="showLoginWrap"
      @login-close="showLoginWrap=false"
      @login-tip="showTip"></login>
  </transition>
</div>
</template>

<script>
import Scroll from 'base/scroll/scroll'
import MyVideo from 'components/MyVideo/MyVideo'
import Login from 'components/Login/Login'
import CommentList from 'components/CommentList/CommentList'
import { mapGetters, mapActions } from 'vuex'
import { baseURL } from 'common/js/config'
import axios from 'axios'
export default {
  created () {
    this.getPopularVideo()
  },
  data () {
    return {
      currentY: 0,
      showCommentList: false,
      showLoginWrap: false,
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
    closeCommentList (e) {
      if (this.showCommentList && (e.target.nodeName === 'VIDEO' || e.target.className.includes('icon-close'))) {
        this.currentCommentVideoId = ''
        e.stopPropagation()
        this.showCommentList = false
      }
    },
    showTip (message) {
      this.$refs.tip.show(message)
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
      'isLogged',
      'popularVideo'
    ])
  },
  watch: {
    isLogged (newVal, oldVal) {
      if (newVal) {
        this.showLoginWrap = false
      }
    }
  },
  beforeRouteLeave (to, from, next) {
    if (to.name !== 'home') {
      if (this.isLogged) {
        next()
      } else {
        this.showLoginWrap = true
      }
    }
    // 导航离开该组件的对应路由时调用
    // 可以访问组件实例 `this`
  },
  components: {
    MyVideo,
    Scroll,
    CommentList,
    Login
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
  position absolute
  top 0
  bottom 0
  left 0
  right 0
  .scroll-wrap
    position absolute
    top 0
    bottom 0
    left 0
    right 0
.back
  position absolute
  left 10px
  top 10px
  padding 8px
  z-index 33
</style>
