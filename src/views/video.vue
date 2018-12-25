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
import VideoList from 'components/VideoList/VideoList'
import NoMore from 'base/NoMore/NoMore'
import Loading from 'base/loading/loading'
import { baseURL } from 'common/js/config'
import axios from 'axios'
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      isLoading: true,
      list: [
        { id: 1, avatar: 'http://www.baidu.com', name: 'hahaha', desc: '一串字符一串字符一串字符', video: 'https://mp4.vjshi.com/2017-08-28/ecbc62447fe2f2be561af3ae1a43a6ab.mp4', likenum: '4.1w', commentnum: '667', sharenum: '4765', time: '昨天', type: '1' },
        { id: 2, avatar: 'http://www.baidu.com', name: 'hahaha', desc: '一串字符一串字符一串字符', video: 'https://mp4.vjshi.com/2017-08-28/ecbc62447fe2f2be561af3ae1a43a6ab.mp4', likenum: '4.1w', commentnum: '667', sharenum: '4765', time: '2018-11-6', type: '2' },
        { id: 3, avatar: 'http://www.baidu.com', name: 'hahaha', desc: '一串字符一串字符一串字符', video: 'https://mp4.vjshi.com/2017-08-28/ecbc62447fe2f2be561af3ae1a43a6ab.mp4', likenum: '4.1w', commentnum: '667', sharenum: '4765', time: '2018-11-6', type: '2' },
        { id: 4, avatar: 'http://www.baidu.com', name: 'hahaha', desc: '一串字符一串字符一串字符', video: 'https://mp4.vjshi.com/2017-08-28/ecbc62447fe2f2be561af3ae1a43a6ab.mp4', likenum: '4.1w', commentnum: '667', sharenum: '4765', time: '2018-11-6', type: '2' }]
    }
  },
  computed: {
    ...mapGetters([
      'loginInfo'
    ])
  },
  mounted () {
    let userId = this.$route.params.id === 'me'? this.loginInfo.userId: this.$route.params.id
    axios.get(`/api/user/${userId}/Videos`, {
      baseURL
    }).then((r)=>{
      this.list = r.data.data
      this.isLoading = false
    })
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
