<template>
<transition name="right">
  <div class="upload-video-wrap">
    <tip ref="tip"></tip>
    <confirm :text="'是否发布动态'"
      @confirm="confirm"
      @cancel="cancel"
      ref="confirm"></confirm>
    <my-header title="发布动态" :hasBack="true" :goBack="goBack"></my-header>
    <div class="content">
      <div class="video-wrap">
        <video class="video" src="" ref="video" @click="playHandler" x5-playsinline="" playsinline="" webkit-playsinline preload="auto"></video>
        <p class="video-guide" v-show="!videoUrl">点击上传或者在下方输入url,推荐使用url</p>
        <input class="video-input" v-show="!videoUrl" type="file" accept="video/*" @change="change">
      </div>
      <div class="content-item">
        <input placeholder="请输入视频链接（如本地上传可不填）" class="input" type="text" v-model="videoUrl">
      </div>
      <div class="content-item">
        <textarea class="input" placeholder="请输入视频描述" rows="10" cols="30" v-model="videoDesc"/>
      </div>
      <div class="content-item">
        <div class="btn" @click="preview">预览</div>
        <div class="btn" @click="upload">发布</div>
      </div>
    </div>
  </div>
</transition>
</template>

<script>
// https://video.pearvideo.com/mp4/adshort/20190122/cont-1509435-13511623_adpkg-ad_hd.mp4
import MyHeader from 'components/MyHeader/MyHeader'
import Confirm from 'base/confirm/confirm'
import { regVideoUrl } from 'common/js/util'
import { mapGetters } from 'vuex'
export default {
  activated () {
    this.$refs.video.src = ''
    this.isLocalVideoFile = false
    this.videoUrl = ''
    this.videoDesc = ''
    this.coverUrl = ''
  },
  data () {
    return {
      isLocalVideoFile: false,
      videoUrl: '',
      videoDesc: '',
      coverUrl: ''
    }
  },
  computed: {
    ...mapGetters([
      'loginInfo'
    ])
  },
  methods: {
    setSrcAndCaptureImage () {
      let that = this
      let v = this.$refs.video
      v.src = this.videoUrl
      v.addEventListener('loadeddata', captureImage)
      v.play()
      function captureImage () {
        let scale = 1
        let canvas = document.createElement('canvas')
        canvas.width = v.videoWidth * scale
        canvas.height = v.videoHeight * scale
        canvas.getContext('2d').drawImage(v, 0, 0, canvas.width, canvas.height)
        v.removeEventListener('loadeddata', captureImage)
        that.coverUrl = canvas.toDataURL('image/png')
      }
    },
    change (e) {
      let files = e.target.files || e.dataTransfer.files
      if (!files.length) return
      this.isLocalVideoFile = true
      this.videoUrl = this.getObjectURL(files[0])
      this.setSrcAndCaptureImage()
    },
    getObjectURL (file) {
      let url = null
      if (window.createObjectURL !== undefined) {
        url = window.createObjectURL(file)
      } else if (window.URL !== undefined) {
        url = window.URL.createObjectURL(file)
      } else if (window.webkitURL !== undefined) {
        url = window.webkitURL.createObjectURL(file)
      }
      return url
    },
    playHandler () {
      if (!this.isLocalVideoFile) {
        if (!regVideoUrl.test(this.videoUrl)) return
      }
      let v = this.$refs.video
      if (v.src !== this.videoUrl) v.src = this.videoUrl
      v.paused ? v.play() : v.pause()
    },
    goBack () {
      this.$router.back()
    },
    preview () {
      if (!this.isLocalVideoFile) {
        if (!regVideoUrl.test(this.videoUrl)) {
          this.$refs.tip.show('请输入有效url')
          return
        }
      }
      this.setSrcAndCaptureImage()
    },
    upload () {
      if (!this.isLocalVideoFile) {
        if (!regVideoUrl.test(this.videoUrl)) {
          this.$refs.tip.show('请输入有效url')
          return
        }
      }
      if (this.videoDesc.trim() && this.videoDesc.length < 200) {
        this.$refs.confirm.show()
      } else {
        this.$refs.tip.show('请输入有效描述')
      }
    },
    confirm () {
      if (this.isLocalVideoFile) {
        // 上传视频到服务器 保存入数据库
      } else {
        // 直接保存入数据库
      }
      console.log(this.videoUrl)
      console.log(this.coverUrl)
    },
    cancel () {

    }
  },
  components: {
    MyHeader,
    Confirm
  }
}
</script>

<style scoped lang='stylus'>
@import '~@/common/stylus/variable'
.right-enter-active, .right-leave-active
  transition all .5s
.right-enter, .right-leave-to
  opacity 0
  transform translateX(100%)
.upload-video-wrap
  position absolute
  z-index 9999
  left 0
  right 0
  top 0
  bottom 0
  background $color-background
  .content
    display flex
    flex-direction column
    .video-wrap
      position relative
      display flex
      background #000
      align-items center
      justify-content center
      height 50vh
      .video-guide
        position absolute
      .video-input
        position absolute
        left 0
        right 0
        top 0
        bottom 0
        opacity 0
      .video
        width 100%
    .content-item
      position relative
      display flex
      padding 10px 20px
      line-height 44px
      height 44px
      justify-content flex-start
      .btn
        padding 10px
        text-align center
        line-height 25px
        font-size $font-size-small
        width 70px
        height 25px
      .input
        width 100%
        background $color-background
        color $color-text
        border none
        font-size $font-size-medium
      &:first-of-type
        height 50%
        padding 0 0 20px 0
        flex-direction column
        align-items center
        border-bottom 1px solid $color-divide
      &:last-of-type
        justify-content space-around
</style>
