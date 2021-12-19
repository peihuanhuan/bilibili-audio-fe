import '.env.js'

import App from './App'
// #ifndef VUE3
import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
// import VConsole from 'vconsole';

Vue.use(ElementUI);

import VueCookies from 'vue-cookies'
Vue.use(VueCookies)


import ajax from './utils/ajax'   // 路径需根据项目实际情况
Vue.prototype.$ajax = ajax         // 挂载在 Vue 原型链上（通过 this.$ajax 调用）


Vue.config.productionTip = false




// const vConsole = new VConsole();

App.mpType = 'app'
const app = new Vue({
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'

export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif