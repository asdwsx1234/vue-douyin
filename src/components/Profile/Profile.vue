<template>
<div class="profile">
    <me-tab class="fiexedtop" v-show="fiexedtopshow"></me-tab>
    <div class="backbtn-wrap" :class="{showbgcolor: fiexedtopshow}">
      <span class="backbtn iconfont icon-left" v-show="this.$route.params.id !== 'me'" @click.stop="GoBack"></span>
      <p class="name" :class="{showname: fiexedtopshow}" v-text="userInfo.userNickname"></p>
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
          <img class="avatar" :src="`${baseURL}${userInfo.userAvatar}`" alt="">
        </div>
        <div class="name-wrap">
          <p class="name" v-text="userInfo.userNickname"></p>
          <p class="subname">抖音号：{{userInfo.userId}}</p>
        </div>
        <div class="desc-wrap">
          <p class="desc" v-text="userInfo.userDesc"></p>
          <div class="gender">
            <div class="icon iconfont" :class="[userInfo.userGender === '男' ? 'icon-man': 'icon-woman']"></div>
            {{userInfo.userAge}}岁
          </div>
          <div class="num-wrap">
            <p>100w获赞</p>
            <p @click="GoInterestList">{{followerNum}}关注</p>
            <p @click="GoFanList">{{fanNum}}粉丝</p>
          </div>
        </div>
        <div class="wrap">
          <me-tab
            :videoNum="videoNum"
            :likeNum="likeNum"></me-tab>
          <keep-alive>
            <router-view
              @showCommentList="showCommentList=true"
              :userInfo="userInfo"
              @chooseVideo="chooseVideo"></router-view>
          </keep-alive>
        </div>
      </div>
    </scroll>
    <transition name="up">
      <comment-list
        v-if="showCommentList"
        :commentList="commentList"
        @close="showCommentList=false"></comment-list>
      <play-list
        class="play-list"
        ref="playList"
        v-show="showPlayList"
        @close="showPlayList=false"></play-list>
    </transition>
</div>
</template>

<script>
import Scroll from 'base/scroll/scroll'
import MeTab from 'components/MeTab/MeTab'
import CommentList from 'components/CommentList/CommentList'
import { baseURL } from 'common/js/config'
import axios from 'axios'
import { mapGetters } from 'vuex'
import PlayList from 'components/PlayList/PlayList'

const instance = axios.create({
  baseURL: baseURL,
  withCredentials: true
})

export default {
  created () {
    if (this.$route.params.id === 'me') {
      this.userInfo = this.loginInfo
      let userId = this.userInfo.userId
      this.getFollowerNum(userId)
      this.getFanNum(userId)
      this.getLikeNum(userId)
      this.getVideoNum(userId)
    } else {
      instance.get(`/api/common/user/${this.$route.params.id}/getUserInfo`).then((r) => {
        this.userInfo = r.data.data
        let userId = this.userInfo.userId
        this.getFollowerNum(userId)
        this.getFanNum(userId)
        this.getLikeNum(userId)
        this.getVideoNum(userId)
      })
    }
  },
  data () {
    return {
      baseURL,
      userInfo: {},
      fanNum: 0,
      likeNum: 0,
      videoNum: 0,
      followerNum: 0,
      bgimgHeight: 150,
      showPlayList: false,
      fiexedtopshow: false,
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
    },
    ...mapGetters([
      'loginInfo'
    ])
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
    },
    chooseVideo (index) {
      this.showPlayList = true
      this.$refs.playList.scrollToIndex(index)
    },
    async getFollowerNum (userId) {
      let res = await instance.get(`/api/user/${userId}/FollowersNum`)
      if (res.data.code === 200) {
        this.followerNum = res.data.data
      }
    },
    async getFanNum (userId) {
      let res = await instance.get(`/api/user/${userId}/FansNum`)
      if (res.data.code === 200) {
        this.fanNum = res.data.data
      }
    },
    async getLikeNum (userId) {
      let res = await instance.get(`/api/user/${userId}/LikesNum`)
      if (res.data.code === 200) {
        this.likeNum = res.data.data
      }
    },
    async getVideoNum (userId) {
      let res = await instance.get(`/api/user/${userId}/VideosNum`)
      if (res.data.code === 200) {
        this.videoNum = res.data.data
      }
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
    CommentList,
    PlayList
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
.play-list
  position fixed
  z-index 9999
  top 0
  left 0
  right 0
  bottom 0
  background $color-background
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
          max-width 50px
          color $color-desc
          .icon
            display inline-block
            width 10px
            height 10px
            font-size 10px
          .icon-man
            color #14bae2
          .icon-woman
            color #da6969
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
