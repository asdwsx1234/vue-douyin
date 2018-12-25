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
      @login-close="showLoginWrap=false"
      @login-tip="showTip"></login>
  </transition>
</div>
</template>

<script>
import Scroll from 'base/scroll/scroll'
import MyVideo from 'components/MyVideo/MyVideo'
import CommentList from 'components/CommentList/CommentList'
import { mapGetters, mapActions } from 'vuex'
export default {
  data () {
    return {
      currentY: 0,
      showCommentList: false,
      showLoginWrap: false,
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
      'isLogged',
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
