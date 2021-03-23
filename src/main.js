import Vue from "vue"
import App from "./App.vue"
import router from "./router"
import "./plugins/element.js"
// 导入 axios 包
import axios from "axios"
// 将 axios 包挂载到 vue 的原型对象中
Vue.prototype.$http = axios
// 配置请求的根路径
axios.defaults.baseURL = "http://127.0.0.1:8888/api/private/v1/"

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount("#app")
