<template>
<div>
    <my-list :Title="$route.params.id" :needBottomMargin="true">
      <div class="chat-item" v-for="item in chatList" :key="item.id">
        <div class="right" v-if="item.isMe">
          <div class="content">
            {{item.content}}
          </div>
          <img class="avatar" src="./1.jpg" alt="" width="40" height="40">
        </div>
        <div class="left" v-else>
          <img class="avatar" src="./1.jpg" alt="" width="40" height="40">
          <div class="content">
            {{item.content}}
          </div>
        </div>
      </div>
    </my-list>
    <div class="input-bar">
      <input class="input" placeholder="  发送消息..." type="text">
      <span class="iconfont icon-at"></span>
      <span class="iconfont icon-at"></span>
    </div>
</div>
</template>

<script>
import MyList from 'base/myList/myList'
export default {
  data () {
    return {
      chatList: [
        { id: 1, isMe: false, content: '我是123，让我们开始聊天吧我是123，让我们开始聊天吧我是123，让我们开始聊天吧' },
        { id: 2, isMe: true, content: '我是123，让我们开始聊天吧我是123我是123，让我们开始聊天吧我是123我是123，让我们开始聊天吧' },
        { id: 3, isMe: false, content: '我是123，让我们开始聊天吧' },
        { id: 4, isMe: true, content: '我是123，让我们开始聊天吧' },
        { id: 5, isMe: false, content: '我是123，让我们开始聊天吧' },
        { id: 6, isMe: true, content: '我是123，让我们开始聊天吧' },
        { id: 7, isMe: true, content: '我是123，让我们开始聊天吧' },
        { id: 8, isMe: false, content: '我是123，让我们开始聊天吧' },
        { id: 9, isMe: true, content: '我是123，让我们开始聊天吧' },
        { id: 10, isMe: true, content: '我是123，让我们开始聊天吧' },
        { id: 11, isMe: false, content: '我是123，让我们开始聊天吧' },
        { id: 12, isMe: true, content: '我是123，让我们开始聊天吧' }
      ]
    }
  },
  components: {
    MyList
  }
}
</script>

<style scoped lang='stylus'>
@import '~@/common/stylus/variable'
.chat-item
  display flex
  width 100%
  & > div
    flex 1
    display flex
    margin 20px 0
  .content
    flex 1
    position relative
    border-radius 5px
    background #fff
    color #000
    padding 10px
  .avatar
    border-radius 50%
    margin 0 15px
  .left
    margin-right 100px
    .content
      &:after
        display block
        position absolute
        top 8px
        left -16px
        border 8px solid transparent
        border-right 8px solid #fff
        content ''
  .right
    margin-left 100px
    .content
      &:after
        display block
        position absolute
        top 8px
        right -16px
        border 8px solid transparent
        border-left 8px solid #fff
        content ''
.input-bar
  position fixed
  width 100%
  display flex
  height 44px
  position absolute
  bottom 0
  background $color-background
  border-top 1px solid $color-divide
  .input
    background $color-background
    flex 1
    font-size $font-size-medium
    color $color-text
    padding-left 10px
    &:focus
      outline none
      border none
  .iconfont
    display flex
    justify-content center
    align-items center
    width 44px
</style>
