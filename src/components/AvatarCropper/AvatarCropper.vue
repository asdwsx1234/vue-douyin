<template>
  <div class="cropperImg">
    <div class="container" v-show="panel">
      <div>
        <img id="image" :src="url">
      </div>
      <button type="button" id="cancel-button" @click="panel = false">取消</button>
      <button type="button" id="button" @click="crop">确定</button>
    </div>
    <div>
        <div class="show">
          <img class="avatar" :src="avatarImage" alt="" width="100" height="100" ref="avatar">
          <span class="desc">点击更换头像</span>
          <input class="img-input" type="file" accept="image/*" id="change" @change="change">
        </div>
    </div>
  </div>
</template>
<script>
import Cropper from 'cropperjs'
export default {
  props: {
    avatarImage: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      picValue: '',
      cropper: '',
      croppable: false,
      panel: false,
      url: '',
      postAvatarImage: ''
    }
  },
  mounted () {
    let image = document.getElementById('image')
    this.cropper = new Cropper(image, {
      aspectRatio: 1,
      viewMode: 1,
      background: false,
      zoomable: true,
      ready: () => {
        this.croppable = true
      }
    })
  },
  methods: {
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
    change (e) {
      let files = e.target.files || e.dataTransfer.files
      if (!files.length) return
      this.panel = true
      this.picValue = files[0]
      this.url = this.getObjectURL(this.picValue)
      if (this.cropper) {
        this.cropper.replace(this.url)
      }
      this.panel = true
    },
    crop () {
      this.panel = false
      let croppedCanvas
      let roundedCanvas
      if (!this.croppable) return
      croppedCanvas = this.cropper.getCroppedCanvas()
      roundedCanvas = this.getRoundedCanvas(croppedCanvas)
      this.postAvatarImage = roundedCanvas.toDataURL()
      this.$emit('getAvatarImage', roundedCanvas.toDataURL())
    },
    getRoundedCanvas (sourceCanvas) {
      let canvas = document.createElement('canvas')
      let context = canvas.getContext('2d')
      let width = sourceCanvas.width
      let height = sourceCanvas.height
      if (width > 90) width = 90
      if (height > 90) height = 90
      canvas.width = width
      canvas.height = height
      context.imageSmoothingEnabled = true
      context.drawImage(sourceCanvas, 0, 0, width, height)
      context.globalCompositeOperation = 'destination-in'
      context.beginPath()
      context.arc(width / 2, height / 2, Math.min(width, height) / 2, 0, 2 * Math.PI, true)
      context.fill()
      return canvas
    }
  }
}
</script>

<style scoped lang='stylus'>
@import '~@/common/stylus/variable'
.container
  position fixed
  top 0
  bottom 0
  left 0
  right 0
  background #fff
  z-index 10000
#cancel-button
  position absolute
  right 20px
  top 60px
#button
  position absolute
  right 20px
  top 20px
.show
  display flex
  justify-content space-between
  height 100%
  line-height 100%
  padding 0 0 20px 0
  flex-direction column
  align-items center
  .img-input
    position absolute
    opacity 0
    top 20px
    width 100px
    height 140px
  .avatar
    margin 20px 0
    border-radius 50%
  .desc
    font-size $font-size-small
    color $color-desc
</style>
