import Vue from "vue"
import App from "./App.vue"
import router from "./router"
import "./plugins/element.js"

// 导入 TreeTable 组件
import TreeTable from "vue-table-with-tree-grid"

// 导入富文本编辑器
import VueQuillEditor from "vue-quill-editor"

// 导入富文本编辑器的相关样式
import "quill/dist/quill.core.css"
import "quill/dist/quill.snow.css"
import "quill/dist/quill.bubble.css"

// 手动注册 TreeTable
Vue.component("tree-table", TreeTable)

// 在全局注册富文本编辑器
Vue.use(VueQuillEditor)

Vue.config.productionTip = false

// 全局过滤器
Vue.filter("dataFormat", function(time) {
  const dt = new Date(time)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + "").padStart(2, "0")
  const d = (dt.getDate() + "").padStart(2, "0")

  const hh = (dt.getHours() + "").padStart(2, "0")
  const mm = (dt.getMinutes() + "").padStart(2, "0")
  const ss = (dt.getSeconds() + "").padStart(2, "0")

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})
new Vue({
  router,
  render: h => h(App)
}).$mount("#app")
