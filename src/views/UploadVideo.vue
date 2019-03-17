<template>
<transition name="right">
  <div class="upload-video-wrap">
    <tip ref="tip"></tip>
    <div class="loading-wrap" v-show="publishing">
      <loading></loading>
    </div>
    <confirm :text="'是否发布动态'"
      @confirm="confirm"
      @cancel="cancel"
      ref="confirm"></confirm>
    <my-header title="发布动态" :hasBack="true" :goBack="goBack"></my-header>
      <div class="content">
        <div class="video-wrap">
          <video class="video" src="" ref="video" @click="playHandler" x5-playsinline="" playsinline="" webkit-playsinline preload="auto"></video>
          <p class="video-guide" v-show="!videoUrl">点击上传或者在下方输入url,推荐使用url</p>
          <input class="video-input" v-show="!videoUrl" type="file" id="file" accept="video/*" @change="change">
        </div>
        <div class="content-item">
          <input placeholder="请输入视频链接（如本地上传可不填）" class="input" type="text" v-model="videoUrl" @blur="inputBlur">
        </div>
        <div class="content-item" v-show="!isLocalVideoFile">
          <input placeholder="请输入封面链接（如本地上传默认第一帧）" class="input" type="text" v-model="coverUrl" @blur="inputBlur">
        </div>
        <div class="content-item">
          <textarea class="input" placeholder="请输入视频描述" rows="10" cols="30" v-model="videoDesc" @blur="inputBlur"/>
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
// https://image.pearvideo.com/cont/20190118/cont-1507651-11802750.jpg
import MyHeader from 'components/MyHeader/MyHeader'
import Confirm from 'base/confirm/confirm'
import Loading from 'base/loading/loading'
import { baseURL } from 'common/js/config'
import { regVideoUrl, regCoverUrl } from 'common/js/util'
import { mapGetters } from 'vuex'
export default {
  activated () {
    this.$refs.video.src = ''
    this.videoUrl = ''
    this.videoDesc = ''
    this.coverUrl = ''
    this.publishing = false
  },
  data () {
    return {
      videoUrl: '',
      videoDesc: '',
      coverUrl: '',
      publishing: false
    }
  },
  computed: {
    isLocalVideoFile () {
      if (this.videoUrl.startsWith('blob:')) {
        return true
      } else {
        return false
      }
    },
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
      function captureImage () {
        v.play()
        if (that.isLocalVideoFile) {
          let scale = 1
          let canvas = document.createElement('canvas')
          canvas.width = v.videoWidth * scale
          canvas.height = v.videoHeight * scale
          canvas.getContext('2d').drawImage(v, 0, 0, canvas.width, canvas.height)
          that.coverUrl = canvas.toDataURL('image/png')
          v.removeEventListener('loadeddata', captureImage)
        }
      }
    },
    change (e) {
      let files = e.target.files || e.dataTransfer.files
      if (!files.length) return
      this.realVideo = files[0]
      this.videoUrl = this.getObjectURL(this.realVideo)
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
    dataURItoBlob (dataURI) { // 图片转成Buffer
      var byteString = atob(dataURI.split(',')[1])
      var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
      var ab = new ArrayBuffer(byteString.length)
      var ia = new Uint8Array(ab)
      for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i)
      }
      return new Blob([ab], { type: mimeString })
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
        if (!regVideoUrl.test(this.videoUrl) || !regCoverUrl.test(this.coverUrl)) {
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
    async confirm () {
      this.publishing = true
      if (this.isLocalVideoFile) {
        // 本地上传视频到服务器，记录保存入数据库
        let fd = new FormData()
        fd.append('videoPath', this.realVideo)
        let r = await this.$axios.post(`/api/user/uploadFile`, fd)
        if (r.status === 200) {
          let filename = r.data.filename
          const videoId = filename.substr(0, filename.indexOf('.'))
          let bolb = this.dataURItoBlob(this.coverUrl)
          let fd1 = new FormData()
          fd1.append('videoId', videoId)
          fd1.append('videoCover', bolb)
          let r1 = await this.$axios.post(`/api/user/uploadCover`, fd1)
          this.publishing = false
          if (r1.status === 200) {
            // 插入数据库
            let r2 = await this.$axios.post(`/api/user/${this.loginInfo.userId}/publishVideo`, {
              videoId,
              videoCover: `${baseURL}/assets/videoCover/${videoId}.jpg`,
              videoPath: `${baseURL}/assets/videoPath/${videoId}.${filename.substr(filename.indexOf('.') + 1)}`,
              videoDesc: this.videoDesc
            })
            if (r2.status === 200) {
              this.$socket.emit('publishVideo', {
                fromUserId: this.loginInfo.userId
              })
              this.$router.push('/profile/me/video')
            } else {
              this.$refs.tip.show('发布失败')
            }
          } else {
            this.$refs.tip.show('上传封面失败')
          }
        }
      } else {
        // url上传，直接将记录保存入数据库
        let videoInfo = {
          videoId: undefined,
          videoCover: this.coverUrl,
          videoPath: this.videoUrl,
          videoDesc: this.videoDesc
        }
        let r = await this.$axios.post(`/api/user/${this.loginInfo.userId}/publishVideo`, videoInfo)
        this.publishing = false
        if (r.status === 200) {
          this.$socket.emit('publishVideo', {
            fromUserId: this.loginInfo.userId
          })
          this.$router.push('/profile/me/video')
        } else {
          this.$refs.tip.show('发布失败')
        }
      }
    },
    cancel () {

    },
    inputBlur () {
      window.scroll(0, 0)
    }
  },
  components: {
    MyHeader,
    Confirm,
    Loading
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
.loading-wrap
  position absolute
  z-index 10000
  left 0
  right 0
  top 0
  bottom 0
  display flex
  justify-content center
  align-items center
  background rgba(0, 0, 0, .7)
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
        height 100%
    .content-item
      position relative
      display flex
      padding 10px 20px
      line-height 44px
      height 44px
      justify-content flex-start
      .btn
        padding 5px
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
