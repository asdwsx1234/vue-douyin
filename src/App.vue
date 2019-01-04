<template>
  <div id="app" :class="{ bcBlack: isHome }">
    <div>
      <keep-alive exclude="me">
        <router-view/>
      </keep-alive>
    </div>
    <div class="tab-wrap">
      <home-tab></home-tab>
    </div>
  </div>
</template>

<script>
import HomeTab from 'components/HomeTab/HomeTab'
import { mapActions, mapGetters } from 'vuex'
export default {
  created () {
    this.persistentConnection().then((res) => {
      if (res.code === 200) {
        this.$socket.emit('login', this.loginInfo.userId)
      }
    })
  },
  sockets: {
    connect: function () {
      console.log('socket connected')
    },
    responselogin (data) {
      // console.log(`socket connected ${data.userId}=====>${data.socketId}`)
    },
    responselogout (data) {
      // console.log(`socket disconnected ${data.userId}=====>${data.socketId}`)
    },
    receiveTriggerFollow () {
      this.getFanUnreadNum(this.loginInfo.userId)
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
      'getFanUnreadNum'
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
