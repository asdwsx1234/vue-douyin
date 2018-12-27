<template>
  <div id="app" :class="{ bcBlack: isHome }">
    <div class="view-wrap">
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
  .view-wrap
    flex 1
  .tab-wrap
    position absolute
    bottom 0
    width 100%
    z-index 100
  .profile
    position absolute
    top 0
    bottom 0
    left 0
    right 0
    z-index 9998
.bcBlack
  background #000
</style>
