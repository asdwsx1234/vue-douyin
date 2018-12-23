<template>
<div @click.capture="c($event)">
  <div class="back iconfont icon-left" v-show="!isHome" @click="$router.back()"></div>
  <scroll class="wrap"
    ref="scroll"
    :probeType="3"
    :data="VideoList"
    :scrollEnd="true"
    :momentum="false"
    @scrollEnd="scrollEnd">
    <div>
      <my-video v-for="item in VideoList"
        :key="item.id"
        :VideoItem="item"
        @showCommentList="showCommentList=true"></my-video>
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
      @login-close="showLoginWrap=false"></login>
  </transition>
</div>
</template>

<script>
import Scroll from 'base/scroll/scroll'
import MyVideo from 'components/MyVideo/MyVideo'
import Login from 'components/Login/Login'
import CommentList from 'components/CommentList/CommentList'
import { mapGetters } from 'vuex'
export default {
  mounted () {
  },
  data () {
    return {
      currentY: 0,
      showCommentList: false,
      showLoginWrap: false,
      VideoList: [{ id: 1, video: 'https://mp4.vjshi.com/2017-08-28/ecbc62447fe2f2be561af3ae1a43a6ab.mp4', avatar: '', name: 'well', desc: '与此同时，网络社交一直在努力通过不断丰富的手段和工具，来替代传统社', likenum: '100', commentnum: '2.1w', sharenum: '2.3w' },
        { id: 2, video: 'http://video.pearvideo.com/mp4/adshort/20181118/cont-1478169-13252496_adpkg-ad_hd.mp4', avatar: '', name: 'well1', desc: '与此同时，网络社交一直在努力通过不断丰富的手段和工具，来替代传统社', likenum: '1000', commentnum: '5.1w', sharenum: '5.2w' },
        { id: 3, video: 'http://video.pearvideo.com/mp4/adshort/20181118/cont-1478156-13252863_adpkg-ad_hd.mp4', avatar: '', name: 'well2', desc: '与此同时，网络社交一直在努力通过不断丰富的手段和工具，来替代传统社', likenum: '2323', commentnum: '2.1w', sharenum: '2333' }
      ],
      commentList: [
        { id: '1', avatar: './1.jpg', name: 'Well', content: '测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试', time: '1分钟前', likeNum: '2w' },
        { id: '2', avatar: './1.jpg', name: 'Well', content: '测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试', time: '1分钟前', likeNum: '2w' },
        { id: '3', avatar: './1.jpg', name: 'Well', content: '测试测试测试测试测试测试测试测试测试测试测试测试测试', time: '1分钟前', likeNum: '2w' },
        { id: '4', avatar: './1.jpg', name: 'Well', content: '测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试', time: '1分钟前', likeNum: '2w' },
        { id: '5', avatar: './1.jpg', name: 'Well', content: '测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试', time: '1分钟前', likeNum: '2w' },
        { id: '6', avatar: './1.jpg', name: 'Well', content: '测试测试测试测试测试测试测试测试测试测试测试测试测试', time: '1分钟前', likeNum: '2w' },
        { id: '7', avatar: './1.jpg', name: 'Well', content: '测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试', time: '1分钟前', likeNum: '2w' },
        { id: '8', avatar: './1.jpg', name: 'Well', content: '测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试', time: '1分钟前', likeNum: '2w' },
        { id: '9', avatar: './1.jpg', name: 'Well', content: '测试测试测试测试测试测试测试测试测试测试测试测试测试', time: '1分钟前', likeNum: '2w' }
      ]
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
    c (e) {
      if (this.showCommentList) {
        e.stopPropagation()
        this.showCommentList = false
      }
    }
  },
  computed: {
    clientHeight () {
      return document.body.clientHeight
    },
    isHome () {
      return this.$route.name === 'home'
    },
    ...mapGetters([
      'isLogged'
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
