import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import fastclick from 'fastclick'
import VueLazyload from 'vue-lazyload'
import 'common/stylus/index.styl'

// 规避eslint检查
/* eslint-disable no-unused-vars */
import Vconsole from 'vconsole'
let vConsole = new Vconsole()
Vue.use(vConsole)

console.log('test')
console.log('foo');   // 白底黑字
console.info('bar');  // 白底紫字
console.debug('oh');  // 白底黄字
console.warn('foo');  // 黄底黄字
console.error('bar'); // 红底红字

Vue.config.productionTip = false
Vue.use(VueLazyload, {
  loading: require('common/image/default.png')
})
fastclick.attach(document.body)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
  store
})
