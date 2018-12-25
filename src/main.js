import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/common/stylus/index.styl'
import Tip from 'base/Tip/Tip'

Vue.config.productionTip = false
Vue.component('Tip', Tip)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
