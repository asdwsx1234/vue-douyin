import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueSocketIO from 'vue-socket.io'
import '@/common/stylus/index.styl'
import Tip from 'base/Tip/Tip'

Vue.config.productionTip = false
Vue.use(new VueSocketIO({
  debug: true,
  connection: 'http://localhost:3000',
  vuex: {
    store,
    actionPrefix: 'SOCKET_',
    mutationPrefix: 'SOCKET_'
  }
}))
Vue.component('Tip', Tip)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
