<template>
<transition name="right-to-left">
<div>
  <my-list :Title="title">
    <li v-for="item in Interests" :key="item.id" class="list-item">
      <img src="./1.jpg" width="45" height="45" alt="" class="avatar">
      <div class="main">
        <p class="name">{{item.name}}</p>
        <p class="desc">{{item.desc}}</p>
      </div>
      <div class="btn">关注</div>
    </li>
  </my-list>
</div>
</transition>
</template>

<script>
import MyList from 'base/myList/myList'
export default {
  data () {
    return {
      Interests: [
        { id: 1, avatar: '', name: 'well', desc: '测试测试测是测试' },
        { id: 2, avatar: '', name: 'well', desc: '测试测试测是测试' },
        { id: 3, avatar: '', name: 'well', desc: '测试测试测是测试' },
        { id: 4, avatar: '', name: 'well', desc: '测试测试测是测试' },
        { id: 5, avatar: '', name: 'well', desc: '测试测试测是测试' },
        { id: 6, avatar: '', name: 'well', desc: '测试测试测是测试' },
        { id: 7, avatar: '', name: 'well', desc: '测试测试测是测试' },
        { id: 8, avatar: '', name: 'well', desc: '测试测试测是测试' },
        { id: 9, avatar: '', name: 'well', desc: '测试测试测是测试' },
        { id: 10, avatar: '', name: 'well', desc: '测试测试测是测试' },
        { id: 11, avatar: '', name: 'well', desc: '测试测试测是测试' },
        { id: 12, avatar: '', name: 'well', desc: '测试测试测是测试' },
        { id: 13, avatar: '', name: 'well', desc: '测试测试测是测试' },
        { id: 14, avatar: '', name: 'well', desc: '测试测试测是测试' },
        { id: 15, avatar: '', name: 'well', desc: '测试测试测是测试' }
      ]
    }
  },
  computed: {
    title () {
      if (this.$route.params.id === 'me') {
        return '我关注的'
      } else {
        return 'TA关注的'
      }
    }
  },
  components: {
    MyList
  }
}
</script>

<style scoped lang='stylus'>
@import '~@/common/stylus/variable'
.right-to-left-enter-active, .right-to-left-leave-active
  transition all .3s
.right-to-left-enter, .right-to-left-leave-to
  opacity 0
  transform scale(0)
.list-item
  padding 10px 10px
  display flex
  align-items center
  .avatar
    margin-right 10px
    border-radius 50%
  .main
    flex 1
    .name
      color $color-text
      font-size $font-size-medium-x
    .desc
      margin-top 5px
      font-size $font-size-small
      color $color-desc
  .btn
    text-align center
    line-height 25px
    font-size $font-size-small
    margin-right 5px
    width 60px
    height 25px
    background rgb(248, 53, 95)
</style>
