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
import { baseURL } from 'common/js/config'
import axios from 'axios'
import { mapGetters, mapMutations } from 'vuex'
export default {
  data () {
    return {
      isLoading: true,
      list: []
    }
  },
  computed: {
    ...mapGetters([
      'loginInfo'
    ])
  },
  mounted () {
    let userId = this.$route.params.id === 'me' ? this.loginInfo.userId : this.$route.params.id
    axios.get(`/api/user/${userId}/Videos`, {
      baseURL,
      withCredentials: true
    }).then((r) => {
      this.list = r.data.data
      this.isLoading = false
    })
  },
  methods: {
    chooseVideo (index) {
      this.SET_PLAYLIST(this.list)
      this.$emit('chooseVideo', index)
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
