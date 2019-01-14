<template>
  <swipeout class="message-list">
    <swipeout-item class="message-item" v-for="item in items" :key="item.fromId" >
        <div slot="right-menu">
          <swipeout-button type="warn">删除</swipeout-button>
        </div>
        <div slot="content" class="front" @click="chatWith(item)">
          <img class="avatar" :src="`${baseURL}${item.userAvatar}`" alt="" width="50" height="50">
          <div class="right">
            <div class="top">
              <span class="name">{{item.userNickname}}</span>
              <span class="time">{{formatTime(item.createdAt)}}</span>
            </div>
            <div class="bottom">
              <span class="desc">{{item.content}}</span>
              <span class="point" :class="{ 'point-plus': item.unread > 99 }" v-show="item.unread!==0">{{item.unread > 99 ? '99+' : item.unread}}</span>
            </div>
          </div>
        </div>
    </swipeout-item>
  </swipeout>
</template>

<script>
import { Swipeout, SwipeoutItem, SwipeoutButton } from 'base/swipeout/'
import { baseURL } from 'common/js/config'
import { formatTime } from 'common/js/util'
export default {
  props: {
    items: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      baseURL
    }
  },
  methods: {
    chatWith (item) {
      this.$router.push({ path: `/ChatWith/${item.fromId}`, query: { userNickname: item.userNickname, userAvatar: item.userAvatar } })
    },
    formatTime
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
          height 16px
          width 16px
          background $color-point
          text-align center
          line-height 16px
          color $color-background
          font-size $font-size-small
          font-weight 600
        .point-plus
          border-radius 8px
          width 26px
</style>
