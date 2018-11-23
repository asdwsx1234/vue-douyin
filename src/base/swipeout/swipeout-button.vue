<template>
  <span class="vux-swipeout-button"
  :class="{'vux-swipeout-button-primary': type === 'primary', 'vux-swipeout-button-warn': type === 'warn', 'vux-swipeout-button-default': type === 'default'}" :style="{backgroundColor: backgroundColor}" @click="onButtonClick" type="button">
    <slot>{{text}}</slot>
  </span>
</template>

<script>
export default {
  name: 'swipeout-button',
  props: {
    text: String,
    backgroundColor: String,
    type: String
  },
  methods: {
    onButtonClick () {
      if (this.$parent.$options._componentTag === 'swipeout-item') {
        this.$parent.onItemClick(this.text)
      }
    }
  }
}
</script>
