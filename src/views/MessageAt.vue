<template>
<div>
  <my-list Title="@我的" @scrollToEnd="scrollToEnd">
    <li v-for="item in list" :key="item.userId" class="list-item">
      <img :src="`${baseURL}${item.userAvatar}`" width="45" height="45" alt="" class="avatar">
      <div class="main">
        <p class="name">@{{item.userNickname}}</p>
        <p class="name">{{item.commentContent}}</p>
        <p class="desc">提到了你 {{formatTime(item.createdAt)}}</p>
      </div>
      <img class="cover" :src="item.videoCover" alt="" width="60" height="60">
    </li>
    <div v-if="!list.length" class="tip-wrap">
      <p>您还没有被@哦</p>
      <p class="desc">赶快去和好友互动起来吧！</p>
    </div>
    <loading v-show="isLoading"></loading>
  </my-list>
</div>
</template>

<script>
import MyList from 'base/myList/myList'
import { baseURL } from 'common/js/config'
import { formatTime } from 'common/js/util'
import { mapGetters, mapActions } from 'vuex'
import Loading from 'base/loading/loading'
const PER_PAGE_LIMIT_NUM = 21
export default {
  created () {
    this.fetchAtList()
  },
  beforeDestroy () {
    const userId = this.loginInfo.userId
    this.$axios.get(`/api/user/${userId}/readAllAt`).then(() => {
      this.getAtUnreadNum(userId)
    })
  },
  data () {
    return {
      list: [],
      isLoading: false,
      page: 0,
      isEnd: false,
      baseURL
    }
  },
  computed: {
    ...mapGetters([
      'loginInfo'
    ])
  },
  methods: {
    fetchAtList () {
      if (this.isEnd) return
      let userId = this.loginInfo.userId
      this.isLoading = true
      this.page++
      this.$axios.get(`/api/user/${userId}/getAt/page/${this.page}`).then((r) => {
        this.isLoading = false
        if (r.data.data.length < PER_PAGE_LIMIT_NUM) {
          this.isEnd = true
        }
        this.list = this.list.concat(r.data.data)
      })
    },
    scrollToEnd () {
      this.fetchAtList()
    },
    ...mapActions([
      'getAtUnreadNum'
    ]),
    formatTime
  },
  components: {
    MyList,
    Loading
  }
}
</script>

<style scoped lang='stylus'>
@import '~@/common/stylus/variable'
.tip-wrap
  position absolute
  left 50%
  transform translateX(-50%)
  margin-top 130px
  text-align center
  .desc
    margin-top 10px
    font-size $font-size-small
    color $color-desc
.list-item
  padding 10px 10px
  display flex
  align-items center
  background rgb(28, 31, 42)
  .avatar
    margin-right 10px
    border-radius 50%
  .main
    flex 1
    .name
      color $color-text
      margin-top 5px
      font-size $font-size-medium
    .desc
      margin-top 10px
      font-size $font-size-small
      color $color-desc
  .cover
    border-radius 5px
</style>
