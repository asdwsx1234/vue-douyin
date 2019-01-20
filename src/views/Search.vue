<template>
<div class="searchWrap">
  <div class="topBar">
    <span class="iconfont icon-left" @click="$router.push('/home')"></span>
    <search-bar
    class="searchBar"
    :placeholder="placeholder"
    ref="searchBar"
    @query="query"></search-bar>
  </div>
  <div class="tab">
    <router-link tag="div" class="tab-item" to="/search/video">
      <span class="tab-link">视频</span>
    </router-link>
    <router-link tag="div" class="tab-item" to="/search/user">
      <span class="tab-link">用户</span>
    </router-link>
  </div>
  <router-view
    :searches="searches"
    @select="selectItem"
    @chooseVideo="chooseVideo"
    @scrollToEnd="scrollToEnd"></router-view>
  <transition name="left">
    <play-list
      class="play-list"
      ref="playList"
      v-show="showPlayList"
      @close="showPlayList=false"></play-list>
  </transition>
</div>
</template>

<script>
import PlayList from 'components/PlayList/PlayList'
import SearchBar from 'base/searchBar/searchBar'
import { mapGetters, mapMutations } from 'vuex'
const PER_PAGE_LIMIT_NUM = 21
export default {
  data () {
    return {
      querykey: '',
      searches: [],
      page: 0,
      isEnd: false,
      showPlayList: false
    }
  },
  watch: {
    '$route' (newVal) {
      this.$refs.searchBar.clear()
      this.querykey = ''
      this.page = 1
      this.isEnd = false
      this.searches = []
      this.showPlayList = false
    }
  },
  computed: {
    placeholder () {
      let routeName = this.$route.name
      if (routeName === 'search/user') {
        return '输入关键字进行搜索（昵称、id）'
      } else if (routeName === 'search/video') {
        return '输入关键字进行搜索（视频描述）'
      }
    },
    ...mapGetters([
      'loginInfo'
    ])
  },
  methods: {
    scrollToEnd () {
      if (this.isEnd) return
      let routeName = this.$route.name
      if (routeName === 'search/user') {
        this.page++
        this.fetchSearchUserList()
      } else if (routeName === 'search/video') {
        this.page++
        this.fetchSearchVideoList()
      }
    },
    query (q) {
      this.querykey = q
      if (!q) return
      let routeName = this.$route.name
      this.page = 1
      this.isEnd = false
      this.searches = []
      if (routeName === 'search/user') {
        this.fetchSearchUserList()
      } else if (routeName === 'search/video') {
        this.fetchSearchVideoList()
      }
    },
    fetchSearchUserList () {
      if (this.isEnd) return
      this.$axios.post(`/api/user/${this.loginInfo.userId}/searchUser/${this.page}`, {
        key: this.querykey
      }).then(r => {
        if (r.data.data.length < PER_PAGE_LIMIT_NUM) {
          this.isEnd = true
        }
        this.searches = this.searches.concat(r.data.data)
      })
    },
    fetchSearchVideoList () {
      if (this.isEnd) return
      this.$axios.post(`/api/user/${this.loginInfo.userId}/searchVideo/${this.page}`, {
        key: this.querykey
      }).then(r => {
        if (r.data.data.length < PER_PAGE_LIMIT_NUM) {
          this.isEnd = true
        }
        this.searches = this.searches.concat(r.data.data)
      })
    },
    selectItem (item) {
      this.$router.push(`/profile/${item.userId}`)
    },
    chooseVideo (index) {
      this.showPlayList = true
      this.SET_PLAYLIST(this.searches)
      this.$refs.playList.scrollToIndex(index)
    },
    ...mapMutations([
      'SET_PLAYLIST'
    ])
  },
  components: {
    SearchBar,
    PlayList
  }
}
</script>

<style scoped lang='stylus'>
@import '~@/common/stylus/variable'
.left-enter-active, .left-leave-active
  transition all .5s
.left-enter, .left-leave-to
  opacity 0
  transform translateX(100%)
.searchWrap
  width 100%
  .play-list
    position fixed
    z-index 9999
    top 0
    left 0
    right 0
    bottom 0
    background $color-background
  .tab
    display flex
    .tab-item
      flex 1
      text-align center
      .tab-link
        display block
        padding 12px
        color $color-desc
      &.router-link-exact-active
        .tab-link
          color $color-white
          border-bottom 2px solid $color-point
  .topBar
    display flex
    .searchBar
      flex 1
      margin-right 10px
    .icon-left
      text-align center
      width 44px
      line-height 44px
  .search-list-wrap
    overflow hidden
    position absolute
    top 88px
    bottom 0
    width 100%
</style>
