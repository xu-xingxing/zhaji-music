import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import state from './state'
import mutations from './mutations'
// Vuex提供的插件，logger,每次通过mutation方式修改state,会在后台打印修改日志
import createLogger from 'vuex/dist/logger'
// 注册Vuex
Vue.use(Vuex)

// 严格模式，检测对于state的修改是否来源于mutation,上线不建议使用，影响性能
const debug = process.env.NODE_ENV !== 'prodection'

export default new Vuex.Store({
  actions,
  getters,
  state,
  mutations,
  strict: debug,
  plugins: debug ? [createLogger()] : []
})
