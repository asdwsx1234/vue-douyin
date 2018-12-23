<template>
<div class="profile">
    <me-tab class="fiexedtop" v-show="fiexedtopshow"></me-tab>
    <div class="backbtn-wrap" :class="{showbgcolor: fiexedtopshow}">
      <span class="backbtn iconfont icon-left" @click.stop="GoBack"></span>
      <p class="name" :class="{showname: fiexedtopshow}">well</p>
      <span class="dotbtn iconfont icon-ellipsis"></span>
    </div>
    <div class="background" :style="bgimgStyle" @touchstart.prevent>
      <img class="bg" src="./1.jpg" alt="">
    </div>
    <scroll class="bottom"
            :probeType="3"
            :listenScroll="true"
            @scroll="scrollHandler"
            ref="scroll"
            @click="showCommentList=false">
      <div class="profile">
        <div class="avatar-wrap">
          <img class="avatar" src="./1.jpg" alt="">
        </div>
        <div class="name-wrap">
          <p class="name">well</p>
          <p class="subname">抖音号：123456</p>
        </div>
        <div class="desc-wrap">
          <p class="desc">填写个性签名更容易获得别人关注哦</p>
          <div class="gender">
            <div class="icon iconfont icon-man"></div>
            21岁
          </div>
          <div class="num-wrap">
            <p>100w获赞</p>
            <p @click="GoInterestList">100w关注</p>
            <p @click="GoFanList">100w粉丝</p>
          </div>
        </div>
        <div class="wrap">
          <me-tab></me-tab>
          <router-view
          @showCommentList="showCommentList=true"></router-view>
        </div>
      </div>
    </scroll>
    <transition name="up">
      <comment-list
        v-if="showCommentList"
        :commentList="commentList"
        @close="showCommentList=false"></comment-list>
    </transition>
</div>
</template>

<script>
import Scroll from 'base/scroll/scroll'
import MeTab from 'components/MeTab/MeTab'
import CommentList from 'components/CommentList/CommentList'
export default {
  activated () {
    console.log(this.$route)
  },
  data () {
    return {
      fiexedtopshow: false,
      bgimgHeight: 150,
      showCommentList: false,
      commentList: [
        { id: '1', avatar: './1.jpg', name: 'Well', content: '测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试', time: '1分钟前', likeNum: '2w' },
        { id: '2', avatar: './1.jpg', name: 'Well', content: '测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试', time: '1分钟前', likeNum: '2w' },
        { id: '3', avatar: './1.jpg', name: 'Well', content: '测试测试测试测试测试测试测试测试测试测试测试测试测试', time: '1分钟前', likeNum: '2w' },
        { id: '4', avatar: './1.jpg', name: 'Well', content: '测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试', time: '1分钟前', likeNum: '2w' },
        { id: '5', avatar: './1.jpg', name: 'Well', content: '测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试', time: '1分钟前', likeNum: '2w' },
        { id: '6', avatar: './1.jpg', name: 'Well', content: '测试测试测试测试测试测试测试测试测试测试测试测试测试', time: '1分钟前', likeNum: '2w' },
        { id: '7', avatar: './1.jpg', name: 'Well', content: '测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试', time: '1分钟前', likeNum: '2w' },
        { id: '8', avatar: './1.jpg', name: 'Well', content: '测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试', time: '1分钟前', likeNum: '2w' },
        { id: '9', avatar: './1.jpg', name: 'Well', content: '测试测试测试测试测试测试测试测试测试测试测试测试测试', time: '1分钟前', likeNum: '2w' }
      ]
    }
  },
  computed: {
    bgimgStyle () {
      let height = Math.max(150, this.bgimgHeight)
      let scale = height / 150
      return {
        height: height + 'px',
        transform: `scaleX(${scale})`
      }
    }
  },
  methods: {
    scrollHandler (pos) {
      if (this.showCommentList) {
        this.showCommentList = false
      }
      if (pos.y > 0) {
        this.bgimgHeight = pos.y + 150
      }
      if (pos.y < -360) {
        this.fiexedtopshow = true
      } else {
        this.fiexedtopshow = false
      }
    },
    GoBack () {
      let path = localStorage.getItem('Routefrom')
      this.$router.push(path)
    },
    GoInterestList () {
      this.$router.push(`/InterestList/${this.$route.params.id}`)
    },
    GoFanList () {
      this.$router.push(`/FanList/${this.$route.params.id}`)
    }
  },
  watch: {
    '$route': function () {
      if (this.showCommentList) {
        this.showCommentList = false
      }
      this.$nextTick(() => {
        this.fiexedtopshow = false
        this.$refs.scroll.refresh()
      })
    }
  },
  components: {
    Scroll,
    MeTab,
    CommentList
  }
}
</script>

<style scoped lang='stylus'>
@import '~@/common/stylus/variable'
.up-enter-active, .up-leave-active
  transition all .5s
.up-enter, .up-leave-to
  opacity 0
  transform translateY(100%)
.fiexedtop
  position fixed
  z-index 255
  top 42px
  left 0
  right 0
  background $color-background
.showbgcolor
  background $color-background
.backbtn-wrap
  position fixed
  top 0
  height 42px
  width 100%
  display flex
  z-index 255
  align-items center
  transition all 0.3s
  .name
    visibility hidden
    text-align center
    flex 1
  .showname
    visibility visible
  .backbtn
    margin-left 10px
    padding 8px
    background rgba(22, 24, 35, .6)
    border-radius 50%
    font-size $font-size-small
  .dotbtn
    margin-right 10px
    padding 8px
    background rgba(22, 24, 35, .6)
    border-radius 50%
    font-size $font-size-small
    font-weight 600
.profile
  .background
    width 100%
    height 150px
    .bg
      width 100%
      height 100%
  .bottom
    position absolute
    top 0
    left 0
    bottom 0
    right 0
    margin 150px 0 44px 0
    .profile
      position relative
      width 100%
      background $color-background
      .avatar-wrap
        position absolute
        left 10px
        top -15px
        border-radius 50%
        padding 5px
        width 80px
        height 80px
        background $color-background
        .avatar
          border-radius 50%
          width 100%
          height 100%
      .name-wrap
        margin 0 10px
        padding 80px 10px 10px
        border-bottom 1px solid $color-divide
        .name
          color $color-white
          font-size $font-size-large-x
        .subname
          margin-top 5px
          color $color-white
          font-size $font-size-small
      .desc-wrap
        margin 10px
        .desc
          color $color-desc
          font-size $font-size-small
        .gender
          margin-top 10px
          padding 5px 8px
          border-radius 5px
          background rgba(67, 51, 63, 0.7)
          font-size $font-size-small-s
          width 40px
          color $color-desc
          .icon
            display inline-block
            width 10px
            height 10px
            font-size 10px
            color #14bae2
        .num-wrap
          margin-top 10px
          width 200px
          display flex
          justify-content space-between
        .num-wrap > p
          font-size $font-size-medium
        .wrap
          position relative
          height 100%
</style>
