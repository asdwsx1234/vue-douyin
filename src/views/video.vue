<template>
  <div class="video">
    <loading v-if="isLoading"></loading>
    <div v-if="!isLoading">
      <video-list
      :list="list"
      @chooseVideo="chooseVideo"></video-list>
      <no-more class="no-more"></no-more>
    </div>
  </div>
</template>

<script>
import VideoList from 'components/VideoList/VideoList'
import NoMore from 'base/NoMore/NoMore'
import Loading from 'base/loading/loading'
import { mapGetters, mapMutations } from 'vuex'
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
    chooseVideo (index) {
      this.SET_PLAYLIST(this.list)
      this.$emit('chooseVideo', index)
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
    ...mapMutations([
      'SET_PLAYLIST'
    ])
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
