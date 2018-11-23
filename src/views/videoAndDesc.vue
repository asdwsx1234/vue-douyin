<template>
  <div>
    <loading v-if="isLoading"></loading>
    <div v-if="!isLoading">
      <followed-list @close="close" :list="list" @showCommentList="showCommentList"></followed-list>
    </div>
  </div>
</template>

<script>
import Loading from 'base/loading/loading'
import FollowedList from 'components/FollowedList/FollowedList'
export default {
  data () {
    return {
      isLoading: true,
      list: [
        { id: 1, avatar: 'http://www.baidu.com', name: 'hahaha', desc: '一串字符一串字符一串字符', video: 'https://mp4.vjshi.com/2017-08-28/ecbc62447fe2f2be561af3ae1a43a6ab.mp4', likenum: '4.1w', commentnum: '667', sharenum: '4765', time: '昨天' },
        { id: 2, avatar: 'http://www.baidu.com', name: 'hahaha', desc: '一串字符一串字符一串字符', video: 'http://video.pearvideo.com/mp4/adshort/20181118/cont-1478169-13252496_adpkg-ad_hd.mp4', likenum: '4.1w', commentnum: '667', sharenum: '4765', time: '2018-11-6' },
        { id: 3, avatar: 'http://www.baidu.com', name: 'hahaha', desc: '一串字符一串字符一串字符', video: 'http://video.pearvideo.com/mp4/adshort/20181118/cont-1478156-13252863_adpkg-ad_hd.mp4', likenum: '4.1w', commentnum: '667', sharenum: '4765', time: '2018-11-6' }
      ]
    }
  },
  mounted () {
    setTimeout(() => {
      this.isLoading = false
    }, 500)
  },
  methods: {
    showCommentList () {
      this.$emit('showCommentList')
    },
    close () {
      this.$emit('close')
    }
  },
  components: {
    FollowedList,
    Loading
  }
}
</script>

<style scoped lang='stylus'>

</style>
