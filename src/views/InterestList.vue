<template>
<div>
  <tip ref="tip"></tip>
  <my-list :Title="title" @scrollToEnd="scrollToEnd">
    <li v-for="item in list" :key="item.userinfo.id" class="list-item" @click="chooseUser($event, item.userinfo.userId)">
      <img :src="`${baseURL}${item.userinfo.userAvatar}`" width="45" height="45" alt="" class="avatar">
      <div class="main">
        <p class="name">{{item.userinfo.userNickname}}</p>
        <p class="desc">{{item.userinfo.userDesc}}</p>
      </div>
      <div class="btn btn-inactive" @click="triggerFollow($event.target, item)" v-html="item.bothStatus? '互相关注': '已关注'"></div>
    </li>
    <no-more class="no-more" v-if="!isLoading"></no-more>
    <loading v-else></loading>
  </my-list>
</div>
</template>

<script>
import MyList from 'base/myList/myList'
import { baseURL } from 'common/js/config'
import { addClass, removeClass } from 'common/js/dom'
import NoMore from 'base/NoMore/NoMore'
import { mapGetters } from 'vuex'
import Loading from 'base/loading/loading'
const PER_PAGE_LIMIT_NUM = 21
export default {
  activated () {
    this.list = []
    this.page = 0
    this.isEnd = false
    this.fetchInterestList()
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
  methods: {
    fetchInterestList () {
      if (this.isEnd) return
      let userId = this.$route.params.id === 'me' ? this.loginInfo.userId : this.$route.params.id
      this.isLoading = true
      this.page++
      this.$axios.get(`/api/user/${userId}/Followers/page/${this.page}`).then((r) => {
        this.isLoading = false
        if (r.data.data.length < PER_PAGE_LIMIT_NUM) {
          this.isEnd = true
        }
        this.list = this.list.concat(r.data.data)
      })
    },
    triggerFollow (target, item) {
      this.$axios.get(`/api/user/${this.loginInfo.userId}/triggerFollow/${item.userinfo.userId}`).then(res => {
        if (res.data.data.includes('取消')) {
          addClass(target, 'btn-active')
          target.innerText = '关注'
          this.$refs.tip.show('取关成功')
        } else {
          removeClass(target, 'btn-active')
          target.innerText = item.bothStatus? '互相关注': '已关注'
          this.$refs.tip.show('关注成功')
        }
      }).catch(e => {
        this.$refs.tip.show('网络错误')
      })
    },
    chooseUser (e, userId) {
      if (e.target.className.includes('btn')) return
      this.$router.push(`/profile/${userId}`)
    },
    scrollToEnd () {
      this.fetchInterestList()
    }
  },
  computed: {
    title () {
      if (this.$route.params.id === 'me') {
        return '我关注的'
      } else {
        return 'TA关注的'
      }
    },
    ...mapGetters([
      'loginInfo'
    ])
  },
  components: {
    MyList,
    Loading,
    NoMore
  }
}
</script>

<style scoped lang='stylus'>
@import '~@/common/stylus/variable'
.no-more
  margin-top 20px
.list-item
  padding 10px 10px
  display flex
  align-items center
  .avatar
    margin-right 10px
    border-radius 50%
  .main
    flex 1
    .name
      color $color-text
      font-size $font-size-medium-x
    .desc
      margin-top 5px
      font-size $font-size-small
      color $color-desc
  .btn
    text-align center
    line-height 25px
    font-size $font-size-small
    margin-right 5px
    width 70px
    height 25px
  .btn-inactive
    background rgb(56, 59, 68)
  .btn-active
    background rgb(248, 53, 95)
</style>
