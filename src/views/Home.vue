<template>
<div @click.capture="closeCommentList($event)">
  <tip ref="tip"></tip>
  <scroll class="wrap"
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
      @close="showCommentList=false"></comment-list>
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
      commentList: [],
      page: 0
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
    fetchCommentsAndShowList (videoId) {
      this.page++
      axios.get(`/api/video/${videoId}/getVideoComment/page/1`,{
        baseURL,
        withCredentials: true
      }).then((res) => {
        this.commentList = res.data.data
        this.showCommentList = true
      })
    },
    closeCommentList (e) {
      if (this.showCommentList) {
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
