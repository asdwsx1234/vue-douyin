<template>
<scroll class="search-list"
  @scrollToEnd="scrollToEnd"
  :pullup="true">
  <tip ref="tip"></tip>
  <ul>
    <li class="search-item" v-for="item in searches" :key="item.id" @click="selectItem(item)">
      <img class="avatar" :src="`${baseURL}${item.userAvatar}`" width="50" height="50">
      <div class="main">
        <span class="name">{{item.userNickname}}</span>
        <span class="desc">{{item.userDesc}}</span>
      </div>
      <div class="btn" :class="['follow', 'both'].includes(item.myRelation) ? 'btn-inactive' : 'btn-active'" @click.stop="triggerFollow($event.target, item)" v-html="getBtnHtml(item.myRelation)"></div>
    </li>
  </ul>
</scroll>
</template>

<script>
import { baseURL } from 'common/js/config'
import Scroll from 'base/scroll/scroll'
import { mapGetters } from 'vuex'
export default {
  props: {
    searches: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      baseURL,
      timer: null
    }
  },
  computed: {
    ...mapGetters([
      'loginInfo'
    ])
  },
  methods: {
    selectItem (item) {
      this.$emit('select', item)
    },
    scrollToEnd () {
      if (this.searches.length === 0) return
      this.$emit('scrollToEnd')
    },
    triggerFollow (target, item) {
      if (this.timer) return
      this.timer = setTimeout(() => {
        this.$axios.get(`/api/user/${this.loginInfo.userId}/triggerFollow/${item.userId}`).then(res => {
          if (res.data.data.includes('取消')) {
            this.$refs.tip.show('取关成功')
            switch (item.myRelation) {
              case 'follow': item.myRelation = 'none'; break
              case 'both': item.myRelation = 'fan'; break
            }
          } else {
            this.$refs.tip.show('关注成功')
            switch (item.myRelation) {
              case 'fan': item.myRelation = 'both'; break
              case 'none': item.myRelation = 'follow'; break
            }
          }
          this.$socket.emit('sendTriggerFollow', {
            fromUserId: this.loginInfo.userId,
            toUserId: item.userId
          })
          this.timer = null
        }).catch(e => {
          this.$refs.tip.show('网络错误')
          this.timer = null
        })
      }, 300)
    },
    getBtnHtml (myRelation) {
      switch (myRelation) {
        case 'fan':
        case 'none': return '关注'
        case 'follow': return '已关注'
        case 'both': return '互相关注'
      }
    }
  },
  components: {
    Scroll
  }
}
</script>

<style scoped lang='stylus'>
@import '~@/common/stylus/variable'
.search-list
  overflow hidden
  position absolute
  top 88px
  bottom 0
  width 100%
  background $color-background
  .search-item
    display flex
    align-items center
    padding 0 0 20px 20px
    .btn
      text-align center
      line-height 25px
      font-size $font-size-small
      margin-right 20px
      width 70px
      height 25px
    .btn-inactive
      background rgb(56, 59, 68)
    .btn-active
      background rgb(248, 53, 95)
    .avatar
      border-radius 50%
    .main
      flex 1
      display flex
      flex-direction column
      margin-left 10px
      .name
        color $color-text
        font-size $font-size-medium
      .desc
        margin-top 10px
        color $color-desc
        font-size $font-size-small
</style>
