<template>
  <div>
    <img class="cover" :src="item.Video.videoCover" alt="">
    <i class="icon iconfont icon-delete" v-if="$route.params.id === 'me'" @click.stop="delVideo"></i>
    <div class="desc">
      <div>
        <i class="icon iconfont icon-heart"></i>{{item.WSLCNum.likeNum}}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  methods: {
    delVideo () {
      this.$emit('delVideo', this.item.Video.videoId)
    }
  }
}
</script>

<style scoped lang='stylus'>
@import '~@/common/stylus/variable'
.cover
  height 100%
  width 100%
.icon-delete
  position absolute
  right 5px
  top 5px
  font-size $font-size-large
  padding 0 0 10px 10px
.desc
  position absolute
  left 5px
  bottom 5px
  font-size $font-size-small
  .icon
    display inline-block
    width 12px
    height 12px
    font-size 12px
    margin-right 5px
    vertical-align top
</style>
