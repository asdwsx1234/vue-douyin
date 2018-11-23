<template>
  <div class="video">
    <loading v-if="isLoading"></loading>
    <div v-if="!isLoading">
      <video-list :list="list"></video-list>
      <no-more class="no-more"></no-more>
    </div>
  </div>
</template>

<script>
import Loading from 'base/loading/loading'
import VideoList from 'components/VideoList/VideoList'
import NoMore from 'base/NoMore/NoMore'
export default {
  data () {
    return {
      isLoading: true,
      list: [
        { id: 1, avatar: 'http://www.baidu.com', name: 'hahaha', desc: '一串字符一串字符一串字符', video: 'https://mp4.vjshi.com/2017-08-28/ecbc62447fe2f2be561af3ae1a43a6ab.mp4', likenum: '4.1w', commentnum: '667', sharenum: '4765', time: '昨天', type: '2' },
        { id: 2, avatar: 'http://www.baidu.com', name: 'hahaha', desc: '一串字符一串字符一串字符', video: 'https://mp4.vjshi.com/2017-08-28/ecbc62447fe2f2be561af3ae1a43a6ab.mp4', likenum: '4.1w', commentnum: '667', sharenum: '4765', time: '2018-11-6', type: '2' },
        { id: 3, avatar: 'http://www.baidu.com', name: 'hahaha', desc: '一串字符一串字符一串字符', video: 'https://mp4.vjshi.com/2017-08-28/ecbc62447fe2f2be561af3ae1a43a6ab.mp4', likenum: '4.1w', commentnum: '667', sharenum: '4765', time: '2018-11-6', type: '2' },
        { id: 4, avatar: 'http://www.baidu.com', name: 'hahaha', desc: '一串字符一串字符一串字符', video: 'https://mp4.vjshi.com/2017-08-28/ecbc62447fe2f2be561af3ae1a43a6ab.mp4', likenum: '4.1w', commentnum: '667', sharenum: '4765', time: '2018-11-6', type: '2' },
        { id: 5, avatar: 'http://www.baidu.com', name: 'hahaha', desc: '一串字符一串字符一串字符', video: 'https://mp4.vjshi.com/2017-08-28/ecbc62447fe2f2be561af3ae1a43a6ab.mp4', likenum: '4.1w', commentnum: '667', sharenum: '4765', time: '昨天', type: '2' },
        { id: 6, avatar: 'http://www.baidu.com', name: 'hahaha', desc: '一串字符一串字符一串字符', video: 'https://mp4.vjshi.com/2017-08-28/ecbc62447fe2f2be561af3ae1a43a6ab.mp4', likenum: '4.1w', commentnum: '667', sharenum: '4765', time: '2018-11-6', type: '2' },
        { id: 7, avatar: 'http://www.baidu.com', name: 'hahaha', desc: '一串字符一串字符一串字符', video: 'https://mp4.vjshi.com/2017-08-28/ecbc62447fe2f2be561af3ae1a43a6ab.mp4', likenum: '4.1w', commentnum: '667', sharenum: '4765', time: '2018-11-6', type: '2' },
        { id: 8, avatar: 'http://www.baidu.com', name: 'hahaha', desc: '一串字符一串字符一串字符', video: 'https://mp4.vjshi.com/2017-08-28/ecbc62447fe2f2be561af3ae1a43a6ab.mp4', likenum: '4.1w', commentnum: '667', sharenum: '4765', time: '2018-11-6', type: '2' }]
    }
  },
  mounted () {
    setTimeout(() => {
      this.isLoading = false
    }, 500)
  },
  components: {
    VideoList,
    NoMore,
    Loading
  }
}
</script>

<style scoped lang='stylus'>
.no-more
  margin-top 12px
</style>
