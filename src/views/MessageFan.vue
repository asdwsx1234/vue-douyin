<template>
<div>
  <my-list Title="粉丝">
    <li v-for="item in Interests" :key="item.id" class="list-item">
      <img src="./1.jpg" width="45" height="45" alt="" class="avatar">
      <div class="main">
        <p class="name">{{item.name}}</p>
        <p class="name">关注了你</p>
        <p class="desc">刚刚</p>
      </div>
      <div class="btn">关注</div>
    </li>
    <div v-if="!Interests.length" class="tip-wrap">
      <p>您还没有粉丝哦</p>
      <p class="desc">快去拍摄精彩视频吸引粉丝吧！</p>
    </div>
  </my-list>
</div>
</template>

<script>
import MyList from 'base/myList/myList'
export default {
  data () {
    return {
      Interests: [
        { id: 1, avatar: '', name: 'well啊', desc: '测试测试测是测试' },
        { id: 2, avatar: '', name: 'well吧', desc: '测试测试测是测试' },
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
  components: {
    MyList
  }
}
</script>

<style scoped lang='stylus'>
@import '~@/common/stylus/variable'
.tip-wrap
  position absolute
  left 50%
  transform translateX(-50%)
  margin-top 130px
  text-align center
  .desc
    margin-top 10px
    font-size $font-size-small
    color $color-desc
.list-item
  padding 10px 10px
  display flex
  align-items center
  background rgb(28, 31, 42)
  .avatar
    margin-right 10px
    border-radius 50%
  .main
    flex 1
    .name
      color $color-text
      margin-top 5px
      font-size $font-size-medium
    .desc
      margin-top 10px
      font-size $font-size-small
      color $color-desc
  .btn
    text-align center
    line-height 30px
    font-size $font-size-small
    margin-right 5px
    border-radius 5px
    width 80px
    height 30px
    color #fff
    background rgb(253, 44, 85)
</style>
