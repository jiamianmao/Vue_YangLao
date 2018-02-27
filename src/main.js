import Vue from 'vue'
import axios from 'axios'
import qs from 'qs'
import { format } from 'date-fns'

import 'normalize.css/normalize.css'// A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en'

import '@/styles/index.scss' // global css

import App from './App'
import router from './router'
import store from './store'

import '@/icons' // icon
import '@/permission' // permission control
const _import = require('./router/_import_' + process.env.NODE_ENV)

Vue.use(ElementUI)

axios.defaults.timeout = 5000
// axios默认是不携带cookie的
axios.defaults.withCredentials = true

Vue.prototype.$http = axios

Vue.config.productionTip = false

Vue.mixin({
  filters: {
    formatDate(v) {
      if (!v instanceof Date) {
        return '/';
      }
      return format(v, 'YYYY-MM-DD HH:mm:SS')
    }
  }
})

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
