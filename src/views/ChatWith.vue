<template>
<div>
    <my-list :Title="$route.query.userNickname" :needBottomMargin="true" ref="scroll">
      <div class="chat-item" v-for="item in chatList" :key="item.id">
        <div class="right" v-if="item.type !== 'time' && item.content.isMe">
          <div class="content">
            {{item.content.content}}
          </div>
          <img class="avatar" :src="`${baseURL}${loginInfo.userAvatar}`" alt="" width="40" height="40">
        </div>
        <div class="left" v-else-if="item.type !== 'time' && !item.isMe">
          <img class="avatar" :src="`${baseURL}${$route.query.userAvatar}`" alt="" width="40" height="40">
          <div class="content">
            {{item.content.content}}
          </div>
        </div>
        <span class="time" v-else>{{item.content}}</span>
      </div>
    </my-list>
    <div class="input-bar">
      <input class="input" placeholder="  发送消息..." type="text" v-model="privateLetterContent" @keyup.enter="sendPrivateLetter" @blur="inputBlur">
      <span class="iconfont icon-at"></span>
      <span class="iconfont icon-check" @click="sendPrivateLetter"></span>
    </div>
</div>
</template>

<script>
import MyList from 'base/myList/myList'
import { baseURL } from 'common/js/config'
import { parseChatTime } from 'common/js/util'
import { mapGetters } from 'vuex'
export default {
  activated () {
    const myId = this.loginInfo.userId
    const otherId = this.$route.params.id
    this.resetAndGetUnread(otherId)
    this.getPrivateLetter(myId, otherId)
    this.readPrivateLetter(myId, otherId)
    this.sockets.subscribe('receivePrivateLetter', (data) => {
      if (data.fromId === this.loginInfo.userId) return
      this.addMessageLocal({
        type: 'privateLetter',
        content: {
          id: data.fromId,
          isMe: data.fromId === this.loginInfo.userId,
          content: data.content,
          time: data.createdAt
        }
      })
      this.$store.commit('UPDATE_PRIVATELETTER', {
        fromId: data.fromId,
        toId: data.toId,
        content: data.content,
        createdAt: data.createdAt,
        userAvatar: data.userAvatar,
        userNickname: data.userNickname,
        type: 'privateLetter',
        isEnterChat: this.$route.params.id === data.fromId // 是否进入了聊天页面，进入了的话那么该条消息的unread就是0
      })
      this.scrollToBottom()
    })
  },
  updated () {
    this.scrollToBottom()
  },
  data () {
    return {
      unread: 0,
      chatList: [],
      privateLetterContent: '',
      baseURL
    }
  },
  computed: {
    ...mapGetters([
      'loginInfo',
      'allPrivateLetter'
    ])
  },
  watch: {
    allMessage () {
      this.getUnread()
    }
  },
  methods: {
    inputBlur () {
      window.scroll(0, 0)
    },
    scrollToBottom () {
      setTimeout(() => {
        const scroll = this.$refs.scroll.$children[0]
        scroll.scrollTo(0, scroll.scroll.maxScrollY)
      }, 30)
    },
    resetAndGetUnread (id) {
      this.chatList = []
      this.$store.commit('UPDATE_UNREAD_PRIVATELETTER', {
        fromId: id
      })
      this.getUnread()
    },
    getUnread () {
      let unread = 0
      this.allPrivateLetter.forEach(item => {
        unread += item.unread
      })
      this.unread = unread
    },
    async getPrivateLetter (myId, otherId) {
      let res = await this.$axios.get(`/api/user/${myId}/getPrivateLetter/${otherId}`)
      let list = res.data.data
      if (list.length === 0) return
      this.isAddTimeMessage(0, list[0].createdAt)
      for (let [index, value] of list.entries()) {
        // 需要通过判断才能确定是否要添加时间消息
        index > 0 && this.isAddTimeMessage(1, value.createdAt, list[index - 1].createdAt)
        let content = {
          type: 'privateLetter',
          content: {
            id: value.fromId,
            isMe: value.fromId === this.loginInfo.userId,
            content: value.privateLetterContent,
            time: value.createdAt
          }
        }
        this.chatList.push(content)
      }
    },
    async readPrivateLetter (myId, otherId) {
      let res = await this.$axios.get(`/api/user/${myId}/readPrivateLetter/${otherId}`)
      if (res.data.code === 200) {
      }
    },
    /* eslint-disable */
    addMessageLocal(data){
      const message = this.chatList
      if(message.length === 0) {//如果本地原来没有消息，则直接添加时间消息，不需要经过比较判断
        this.isAddTimeMessage(0, data.content.time)
      }else{
        const latestMessage = message[message.length - 1] //本地最新的一条消息
        const latestTime = latestMessage.content.time//该消息的时间
        this.isAddTimeMessage(1, data.content.time, latestTime)
      }
      this.chatList.push(data)  
    },
    //是否要添加时间消息
    isAddTimeMessage(flag, currentTime, prevTime = ''){
      if (flag) {   //当flag为真时,需要比较判断，才能确定是否要添加时间
        const seprator = 30 * 60 * 1000   //时间间隔基准,半个小时
        if(currentTime - prevTime > seprator) {//当下一条消息和这条消息的时间间隔大于30分钟,才添加时间
          this.chatList.push({
            type:'time',
            content: parseChatTime(currentTime)
          })
        } 
      } else {  //当flag为假时,是必须要添加时间消息的
        this.chatList.push({
          type:'time',
          content: parseChatTime(currentTime)
        })
      }
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
          let res = r.data.data
          this.$socket.emit('sendPrivateLetter', {
            fromId: this.loginInfo.userId,
            toId: res.toId,
            content: res.privateLetterContent,
            createdAt: res.createdAt,
            userAvatar: this.loginInfo.userAvatar,
            userNickname: this.loginInfo.userNickname
          })
          this.addMessageLocal({
            type: 'privateLetter',
            content: {
              id: res.fromId,
              isMe: res.fromId === this.loginInfo.userId,
              content: res.privateLetterContent,
              time: res.createdAt
            }
          })
          this.$store.commit('UPDATE_PRIVATELETTER', {
            fromId: res.toId,
            content: res.privateLetterContent,
            createdAt: res.createdAt,
            userAvatar: this.$route.query.userAvatar,
            userNickname: this.$route.query.userNickname,
            type: 'privateLetter',
            isEnterChat: true // 是否进入了聊天页面，进入了的话那么该条消息的unread就是0
          })
          this.scrollToBottom()
        })
        this.privateLetterContent = ''
      }
    }
  },
  beforeRouteLeave (to, from, next) {
    this.sockets.unsubscribe('receivePrivateLetter')
    next()
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
  justify-content center
  .time
    margin-top 10px
    font-size $font-size-small-s
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
    word-break break-all
  .avatar
    flex-shrink 0
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
    justify-content flex-end
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
