module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        assets: "@/assets",
        components: "@/components",
        common: "@/components/common",
        content: "@/components/content",
        views: "@/views",
        network: "@/network",
        home: "@/views/home",
        user: "@/views/user",
        rights: "@/views/power/rights",
        roleList: "@/views/power/roleList",
        cate: "@/views/goods/cate",
        params: "@/views/goods/params",
        goodsList: "@/views/goods/goodsList",
        order: "@/views/order/",
        report: "@/views/report"
      }
    }
  },
  chainWebpack: config => {
    // 指定项目对应的打包入口
    // 处于产品发布模式 打开指定的入口文件
    config.when(process.env.NODE_ENV === "production", config => {
      config
        .entry("app")
        .clear()
        .add("./src/main-prod.js")

      config.set("externals", {
        vue: "Vue",
        "vue-router": "VueRouter",
        axios: "axios",
        lodash: "_",
        echarts: "echarts",
        nprogress: "NProgress",
        "vue-quill-editor": "VueQuillEditor"
      })

      // 自定义首页标题
      config.plugin("html").tap(args => {
        args[0].isProd = true
        return args
      })
    }),
      // 如果处于产品开发模式 打开指定的入口文件
      config.when(process.env.NODE_ENV === "development", config => {
        config
          .entry("app")
          .clear()
          .add("./src/main-dev.js")

        // 自定义首页标题
        config.plugin("html").tap(args => {
          args[0].isProd = false
          return args
        })
      })
  }
}
