<template>
<div class="contact-wrap">
  <my-header class="header-border" title="选择联系人" :hasBack="true"></my-header>
  <list-view :data="groups"></list-view>
</div>
</template>

<script>
import MyHeader from 'components/MyHeader/MyHeader'
import ListView from 'base/listview/listview'
export default {
  data () {
    return {
      groups: [
        { title: '#search' },
        { title: 'A', items: [{ name: 'Ab' }, { name: 'Ac' }] },
        { title: 'B', items: [{ name: 'Bb' }, { name: 'Bc' }] },
        { title: 'C', items: [{ name: 'Cb' }, { name: 'Cc' }] },
        { title: 'D', items: [{ name: 'Db' }, { name: 'Dc' }] },
        { title: 'E', items: [{ name: 'Eb' }, { name: 'Ec' }] },
        { title: 'F', items: [{ name: 'Fb' }, { name: 'Fc' }] },
        { title: 'G', items: [{ name: 'Gb' }, { name: 'Gc' }] }
      ]
    }
  },
  components: {
    MyHeader,
    ListView
  }
}
</script>

<style scoped lang='stylus'>
@import '~@/common/stylus/variable'
.contact-wrap
  position fixed
  top 0
  bottom 0
  left 0
  right 0
  .header-border
    border-bottom .5px solid $color-divide
</style>
