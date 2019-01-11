<template>
<div>
    <my-list :Title="$route.query.userNickname" :needBottomMargin="true">
      <div class="chat-item" v-for="item in chatList" :key="item.id">
        <div class="right" v-if="item.isMe">
          <div class="content">
            {{item.content}}
          </div>
          <img class="avatar" :src="`${baseURL}${loginInfo.userAvatar}`" alt="" width="40" height="40">
        </div>
        <div class="left" v-else>
          <img class="avatar" :src="`${baseURL}${$route.query.userAvatar}`" alt="" width="40" height="40">
          <div class="content">
            {{item.content}}
          </div>
        </div>
      </div>
    </my-list>
    <div class="input-bar">
      <input class="input" placeholder="  发送消息..." type="text" v-model="privateLetterContent">
      <span class="iconfont icon-at"></span>
      <span class="iconfont icon-check" @click="sendPrivateLetter"></span>
    </div>
</div>
</template>

<script>
import MyList from 'base/myList/myList'
import { baseURL } from 'common/js/config'
import { mapGetters } from 'vuex'
export default {
  activated () {
    this.$axios.get(`/api/user/${this.loginInfo.userId}/getPrivateLetter/${this.$route.params.id}`).then(r => {
      this.chatList = this._normalizeChatList(r.data.data)
    })
  },
  data () {
    return {
      chatList: [
        { id: 1, isMe: false, content: '我是123，让我们开始聊天吧我是123，让我们开始聊天吧我是123，让我们开始聊天吧' }
      ],
      privateLetterContent: '',
      baseURL
    }
  },
  computed: {
    ...mapGetters([
      'loginInfo'
    ])
  },
  methods: {
    _normalizeChatList (list) {
      let result = []
      for (let i = 0, len = list.length; i < len; i++){
        let isMe
        isMe = i === 0 ? true : false
        // isMe = list[i].fromId === this.loginInfo.userId ? true : false
        result.push({
          id: list[i].id,
          isMe,
          content: list[i].privateLetterContent
        })
      }
      return result
    },
    sendPrivateLetter () {
      const plc = this.privateLetterContent.trim()
      if (plc) {
        let pl = {
          content: plc,
          fromUserId: this.loginInfo.userId,
          toUserId: this.$route.params.id
        }
        this.$axios.post(`/api/user/${pl.fromUserId}/privateLetter/${pl.toUserId}`, pl).then((r) => {
          console.log('send suc!')
        })
        this.privateLetterContent = ''
      }
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
    float left
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
    float right
    width 100%
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
    caret-color $color-point
    &:focus
      outline none
      border none
  .iconfont
    display flex
    justify-content center
    align-items center
    width 44px
</style>
