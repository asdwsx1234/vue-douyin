<template>
<div @click="c">
  <scroll class="list-wrap"
    :data="list"
    ref="listWrap">
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
import { baseURL } from 'common/js/config'
import { mapGetters } from 'vuex'
import axios from 'axios'
export default {
  created () {
    let userId = this.loginInfo.userId
    axios.get(`/api/user/${userId}/FollowerVideo`, {
      baseURL,
      withCredentials: true
    }).then((r) => {
      this.list = r.data.data
      this.$refs.listWrap.refresh()
      this.isLoading = false
    })
  },
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
      list: []
    }
  },
  computed: {
    ...mapGetters([
      'loginInfo'
    ])
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
