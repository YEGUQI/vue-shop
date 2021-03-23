module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        assets: "@/assets",
        components: "@/components",
        common: "@/components/common",
        content: "@/components/content",
        views: "@/views",
        network: "@/network"
      }
    }
  }
}
