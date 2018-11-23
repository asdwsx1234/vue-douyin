<template>
  <div class="message">
    <my-header title='消息'></my-header>
    <div class="tab-wrap">
      <msg-tab></msg-tab>
    </div>
    <scroll :data="items" class="list-wrap" ref="wrapper">
      <msg-list :items="items"></msg-list>
    </scroll>
    <router-view class="bbb"></router-view>
  </div>
</template>

<script>
import Scroll from 'base/scroll/scroll'
import MyHeader from 'components/MyHeader/MyHeader'
import MsgTab from 'components/MsgTab/MsgTab'
import MsgList from 'components/MsgList/MsgList'
export default {
  mounted () {
    // console.log(this.$refs.wrapper)
  },
  data () {
    return {
      items: [
        { id: 1, name: '抖音小助手', desc: '粉丝', time: '昨天' },
        { id: 2, name: '资讯助手', desc: '赞', time: '2018-11-6' },
        { id: 3, name: '系统通知', desc: '@我的', time: '2018-11-6' },
        { id: 4, name: '哈哈', desc: '评论', time: '2018-11-6' },
        { id: 5, name: '抖音小助手', desc: '粉丝', time: '昨天' },
        { id: 6, name: '资讯助手', desc: '赞', time: '2018-11-6' },
        { id: 7, name: '系统通知', desc: '@我的', time: '2018-11-6' },
        { id: 8, name: '哈哈', desc: '评论', time: '2018-11-6' },
        { id: 9, name: '抖音小助手', desc: '粉丝', time: '昨天' },
        { id: 10, name: '资讯助手', desc: '赞', time: '2018-11-6' }]
    }
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
.bbb
  position fixed
  top 0
  bottom 0
  left 0
  right 0
  z-index 255
  background $color-background
</style>
