<template>
<div @click="c">
  <scroll class="list-wrap"
    :data="list">
    <followed-list :list="list"
      @showCommentList="showCommentList=true"></followed-list>
  </scroll>
  <transition name="up">
    <comment-list
      v-if="showCommentList"
      :commentList="commentList"
      @close="showCommentList=false"></comment-list>
  </transition>
</div>
</template>

<script>
import Scroll from 'base/scroll/scroll'
import FollowedList from 'components/FollowedList/FollowedList'
import CommentList from 'components/CommentList/CommentList'
export default {
  data () {
    return {
      showCommentList: false,
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
      ],
      list: [
        { id: 1, avatar: 'http://www.baidu.com', name: 'hahaha', desc: '一串字符一串字符一串字符', video: 'https://mp4.vjshi.com/2017-08-28/ecbc62447fe2f2be561af3ae1a43a6ab.mp4', likenum: '4.1w', commentnum: '667', sharenum: '4765', time: '昨天' },
        { id: 2, avatar: 'http://www.baidu.com', name: 'hahaha', desc: '一串字符一串字符一串字符', video: 'http://video.pearvideo.com/mp4/adshort/20181118/cont-1478169-13252496_adpkg-ad_hd.mp4', likenum: '4.1w', commentnum: '667', sharenum: '4765', time: '2018-11-6' },
        { id: 3, avatar: 'http://www.baidu.com', name: 'hahaha', desc: '一串字符一串字符一串字符', video: 'http://video.pearvideo.com/mp4/adshort/20181118/cont-1478156-13252863_adpkg-ad_hd.mp4', likenum: '4.1w', commentnum: '667', sharenum: '4765', time: '2018-11-6' }]
    }
  },
  methods: {
    c () {
      if (this.showCommentList) {
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
