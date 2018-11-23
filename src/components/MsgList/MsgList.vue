<template>
  <swipeout class="message-list">
    <swipeout-item class="message-item" v-for="item in items" :key="item.id">
        <div slot="right-menu">
          <swipeout-button type="warn">删除</swipeout-button>
        </div>
        <div slot="content" class="front">
          <img class="avatar" src="./logo.png" alt="" width="50" height="50">
          <div class="right">
            <div class="top">
              <span class="name">{{item.name}}</span>
              <span class="time">{{item.time}}</span>
            </div>
            <div class="bottom">
              <span class="desc">{{item.desc}}</span>
              <span class="point"></span>
            </div>
          </div>
        </div>
    </swipeout-item>
  </swipeout>
</template>

<script>
import { Swipeout, SwipeoutItem, SwipeoutButton } from 'base/swipeout/'
export default {
  props: {
    items: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
    }
  },
  methods: {
  },
  components: {
    Swipeout,
    SwipeoutItem,
    SwipeoutButton
  }
}
</script>

<style scoped lang='stylus'>
@import '~@/common/stylus/variable'
.message-list
  display flex
  flex-direction column
  .message-item
    margin-top 10px
  .front
    display flex
    flex 1
    background $color-background
    transition transform 0.2s
    .avatar
      margin-left 10px
      border-radius 50%
    .right
      position relative
      flex 1
      margin 0 10px
      display flex
      flex-direction column
      justify-content space-around
      .top
        display flex
        justify-content space-between
        .name
          font-weight 500
          color $color-text
        .time
          color $color-time
          font-size $font-size-small
      .bottom
        display flex
        justify-content space-between
        .desc
          color $color-desc
          font-size $font-size-small
        .point
          border-radius 50%
          height 8px
          width 8px
          background $color-point
</style>
