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
        goodsList: "@/views/goods/goodsList"
      }
    }
  }
}
