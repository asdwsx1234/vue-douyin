<template>
  <div class="video-list">
    <video-item
      @click.native="chooseVideo(index)"
      :style="VideoItemHeightStyle"
      class="video-item" v-for="(item, index) in list"
      :key="item.id"
      :item="item"></video-item>
  </div>
</template>

<script>
import VideoItem from 'base/VideoItem/VideoItem'
export default {
  props: {
    list: {
      type: Array,
      required: true
    }
  },
  methods: {
    chooseVideo (index) {
      this.$router.push(`/home/${this.$route.params.id}`)
      console.log(index)
    }
  },
  computed: {
    VideoItemHeightStyle () {
      let clientWidth = document.body.clientWidth
      let height = clientWidth / 3 * 1.3 + 'px'
      return {
        height
      }
    }
  },
  components: {
    VideoItem
  }
}
</script>

<style scoped lang='stylus'>
.video-list
  flex 1
  display flex
  flex-wrap wrap
  .video-item
    box-sizing border-box
    border .5px solid black
    position relative
    flex 0 0 33.333%
</style>
