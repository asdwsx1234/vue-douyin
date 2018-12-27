<template>
  <div class="video">
    <div>
      <video-list
        :list="list"
        @chooseVideo="chooseVideo"></video-list>
      <no-more v-if="!isLoading" class="no-more"></no-more>
      <loading v-else></loading>
    </div>
  </div>
</template>

<script>
import Loading from 'base/loading/loading'
import VideoList from 'components/VideoList/VideoList'
import NoMore from 'base/NoMore/NoMore'
import { baseURL } from 'common/js/config'
import axios from 'axios'
import { mapGetters, mapMutations } from 'vuex'
export default {
  data () {
    return {
      isLoading: true,
      list: [],
      page: 0
    }
  },
  computed: {
    ...mapGetters([
      'loginInfo'
    ])
  },
  created () {
    this.fetchLikeList()
  },
  methods: {
    chooseVideo (index) {
      this.SET_PLAYLIST(this.list)
      this.$emit('chooseVideo', index)
    },
    fetchLikeList () {
      let userId = this.$route.params.id === 'me' ? this.loginInfo.userId : this.$route.params.id
      this.isLoading = true
      this.page++
      axios.get(`/api/user/${userId}/Likes/page/${this.page}`, {
        baseURL,
        withCredentials: true
      }).then((r) => {
        this.isLoading = false
        this.list = this.list.concat(r.data.data)
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
