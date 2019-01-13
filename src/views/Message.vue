<template>
  <div class="message">
    <my-header title='消息'></my-header>
    <div class="tab-wrap">
      <msg-tab></msg-tab>
    </div>
    <scroll :data="allPrivateLetter" class="list-wrap" ref="wrapper">
      <msg-list :items="allPrivateLetter"></msg-list>
      <img class="bgimg" v-if="allPrivateLetter.length === 0" src="./2.jpg"/>
    </scroll>
    <router-view class="bbb"></router-view>
  </div>
</template>

<script>
import Scroll from 'base/scroll/scroll'
import MyHeader from 'components/MyHeader/MyHeader'
import MsgTab from 'components/MsgTab/MsgTab'
import MsgList from 'components/MsgList/MsgList'
import { mapGetters } from 'vuex'
export default {
  mounted () {
    // console.log(this.$refs.wrapper)
  },
  data () {
    return {
    }
  },
  computed: {
    ...mapGetters([
      'allPrivateLetter'
    ])
  },
  components: {
    MyHeader,
    MsgTab,
    MsgList,
    Scroll
  }
}
</script>

<style scoped lang='stylus'>
@import '~@/common/stylus/variable'
.message
  width 100vw
.tab-wrap
  margin 10px
  padding-bottom 20px
  border-bottom 1px solid rgb(38, 39, 50)
.list-wrap
  overflow hidden
  position absolute
  top 0
  bottom 0
  left 0
  right 0
  margin-top 132px
  margin-bottom 44px
  .bgimg
    position absolute
    top 50%
    left 50%
    transform translateX(-50%) translateY(-50%)
.bbb
  position fixed
  top 0
  bottom 0
  left 0
  right 0
  z-index 255
  background $color-background
</style>
