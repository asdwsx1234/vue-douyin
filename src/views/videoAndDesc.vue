<template>
  <div>
    <loading v-if="isLoading"></loading>
    <div v-if="!isLoading">
      <followed-list
        @close="close"
        :list="list"
        @showCommentList="showCommentList"></followed-list>
    </div>
  </div>
</template>

<script>
import Loading from 'base/loading/loading'
import FollowedList from 'components/FollowedList/FollowedList'
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      page: 0,
      isLoading: true,
      list: []
    }
  },
  computed: {
    ...mapGetters([
      'loginInfo'
    ])
  },
  created () {
    this.fetchVideoList()
  },
  methods: {
    showCommentList (videoId, commentNum) {
      this.$emit('showCommentList', videoId, commentNum)
    },
    fetchVideoList () {
      let userId = this.$route.params.id === 'me' ? this.loginInfo.userId : this.$route.params.id
      this.isLoading = true
      this.page++
      this.$axios.get(`/api/user/${userId}/Videos/page/${this.page}`).then((r) => {
        this.list = this.list.concat(r.data.data)
        this.isLoading = false
      })
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
