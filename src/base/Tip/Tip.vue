<template>
  <transition name="up">
      <div class="tip" v-if="showThis">
        {{message}}
      </div>
  </transition>
</template>

<script>
export default {
  props: {
    duration: {
      type: Number,
      default: 2000
    }
  },
  data () {
    return {
      showThis: false,
      timer: null,
      message: 'This is a Tip!'
    }
  },
  methods: {
    show (message) {
      if (this.timer) clearTimeout(this.timer)
      if (message) this.message = message
      this.showThis = true
      this.timer = setTimeout(() => {
        this.message = 'This is a Tip!'
        this.showThis = false
        this.timer = null
      }, this.duration)
    }
  }
}
</script>

<style lang="stylus" scoped>
.up-enter-active, .up-leave-active
  transition all .5s
.up-enter, .up-leave-to
  opacity 0
  transform translateY(100%)
.tip
  position fixed
  top 80vh
  left 50vw
  padding 10px
  border-radius 4px
  transform translateX(-50%)
  z-index 9999
  background rgba(2, 2, 2, .5)
</style>
