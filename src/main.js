import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { baseURL } from 'common/js/config'
import VueSocketIO from 'vue-socket.io'
import axios from 'axios'
import '@/common/stylus/index.styl'
import Tip from 'base/Tip/Tip'

const axiosInstance = axios.create({
  baseURL: baseURL,
  withCredentials: true
})
Vue.prototype.$axios = axiosInstance
Vue.config.productionTip = false
Vue.use(new VueSocketIO({
  debug: false,
  connection: baseURL,
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
