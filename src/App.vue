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
import { mapActions } from 'vuex'
export default {
  created () {
    this.persistentConnection()
    console.log(this)
    this.$socket.emit('haha', 'nishizhu')
  },
  sockets: {
    connect: function () {
      console.log('socket connected')
    },
    haha1111: function (data) {
      console.log('this method was fired by the socket server. eg: io.emit("haha", data)')
    }
  },
  computed: {
    isHome () {
      return this.$route.name === 'home'
    }
  },
  methods: {
    ...mapActions([
      'persistentConnection'
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
