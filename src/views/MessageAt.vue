<template>
<div>
  <my-list Title="@我的">
    <li v-for="item in Interests" :key="item.id" class="list-item">
      <img src="./1.jpg" width="45" height="45" alt="" class="avatar">
      <div class="main">
        <p class="name">@{{item.name}}</p>
        <p class="name">{{item.content}}</p>
        <p class="desc">提到了你 {{item.time}}</p>
      </div>
      <img class="cover" src="./1.jpg" alt="" width="60" height="60">
    </li>
    <div v-if="!Interests.length" class="tip-wrap">
      <p>您还没有被@哦</p>
      <p class="desc">赶快去和好友互动起来吧！</p>
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
        { id: 1, avatar: '', name: 'well啊', content: '@测试小号 艾特', time: '刚刚' }
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
  .cover
    border-radius 5px
</style>
