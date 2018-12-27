<template>
  <div class="spinner7">
    <div class="spinner-container container1">
      <div class="circle1"></div>
      <div class="circle2"></div>
      <div class="circle3"></div>
      <div class="circle4"></div>
    </div>
    <div class="spinner-container container2">
      <div class="circle1"></div>
      <div class="circle2"></div>
      <div class="circle3"></div>
      <div class="circle4"></div>
    </div>
    <div class="spinner-container container3">
      <div class="circle1"></div>
      <div class="circle2"></div>
      <div class="circle3"></div>
      <div class="circle4"></div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
}
</script>

<style scoped lang="stylus">
.spinner7
  margin 40px auto
  width 20px
  height 20px
  position relative
  .spinner-container
    position absolute
    width 100%
    height 100%
    .circle1
      top 0
      left: 0
    .circle2
      top 0
      right 0
    .circle3
      right 0
      bottom 0
    .circle4
      left 0
      bottom 0
  .container1
    .circle2
      animation-delay -0.9s
    .circle3
      animation-delay -0.6s
    .circle3
      animation-delay -0.3s
  .container2
    transform rotateZ(45deg)
    .circle1
      animation-delay -1.1s
    .circle2
      animation-delay -0.8s
    .circle3
      animation-delay -0.5s
    .circle4
      animation-delay -0.2s
  .container3
    transform rotateZ(90deg)
    .circle1
      animation-delay -1.0s
    .circle2
      animation-delay -0.7s
    .circle3
      animation-delay -0.4s
    .circle4
      animation-delay -0.1s
  .container1 > div, .container2 > div, .container3 > div
    width 6px
    height 6px
    background-color rgb(250, 206, 21)
    border-radius 100%
    position absolute
    animation bouncedelay1 1.2s infinite ease-in-out
    animation-fill-mode both
@keyframes bouncedelay1
  0%, 80%, 100%
    transform scale(0.0)
  40%
    transform scale(1.0)
</style>
