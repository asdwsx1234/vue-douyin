<template>
  <div id="app" :class="{ bcBlack: isHome }">
    <keep-alive exclude="me">
      <router-view/>
    </keep-alive>
    <div class="tab-wrap">
      <home-tab></home-tab>
    </div>
  </div>
</template>

<script>
import HomeTab from 'components/HomeTab/HomeTab'
import { mapActions, mapGetters, mapMutations } from 'vuex'
export default {
  created () {
    this.persistentConnection().then((res) => {
      if (res.code === 200) {
        this.$socket.emit('login', this.loginInfo.userId)
      }
    })
  },
  data () {
    return {
    }
  },
  sockets: {
    connect: function () {
      // console.log('socket connected')
    },
    responselogin (data) {
      // console.log(`socket connected ${data.userId}=====>${data.socketId}`)
    },
    responselogout (data) {
      // console.log(`socket disconnected ${data.userId}=====>${data.socketId}`)
    },
    receiveTriggerLike () {
      this.getByLikeUnreadNum(this.loginInfo.userId)
    },
    receiveTriggerFollow () {
      this.getFanUnreadNum(this.loginInfo.userId)
    },
    receiveComment () {
      this.getByCommentUnreadNum(this.loginInfo.userId)
    },
    receiveNewVideo () {
      this.getFollowedNewsNum(this.loginInfo.userId)
    },
    receiveAt () {
      this.getAtUnreadNum(this.loginInfo.userId)
    },
    receivePrivateLetter (data) {
      this.UPDATE_PRIVATELETTER({
        fromId: data.fromId,
        toId: data.toId,
        content: data.content,
        createdAt: data.createdAt,
        userAvatar: data.userAvatar,
        userNickname: data.userNickname,
        type: 'privateLetter',
        isEnterChat: this.$route.params.id === data.fromId // 是否进入了聊天页面，进入了的话那么该条消息的unread就是0
      })
    }
  },
  computed: {
    isHome () {
      return this.$route.name === 'home'
    },
    ...mapGetters([
      'loginInfo'
    ])
  },
  methods: {
    ...mapActions([
      'persistentConnection',
      'getFanUnreadNum',
      'getByLikeUnreadNum',
      'getByCommentUnreadNum',
      'getAtUnreadNum',
      'getFollowedNewsNum'
    ]),
    ...mapMutations([
      'UPDATE_PRIVATELETTER'
    ])
  },
  components: {
    HomeTab
  }
}
</script>
<style lang="stylus" scoped>
#app
  display flex
  position relative
  flex 1
  overflow hidden
  .tab-wrap
    position fixed
    left 0
    bottom 0
    width 100%
.bcBlack
  background #000
</style>
