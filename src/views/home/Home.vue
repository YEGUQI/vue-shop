<template>
  <div class="contain-height">
    <!-- 头部区域 -->
    <ELHeader></ELHeader>
    <el-container class="contain-height">
      <!-- 左侧侧边栏区域 -->
      <ELAsideMenu></ELAsideMenu>
      <!-- 右侧内容区域 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import ELAsideMenu from "./childComps/ELAsideMenu.vue"
import ELHeader from "./childComps/ELHeader.vue"

export default {
  name: "Home",
  components: {
    ELAsideMenu,
    ELHeader
  },
  data() {
    return {}
  }
}
</script>

<style lang="less" scoped>
.contain-height {
  height: 100%;
}
.el-aside {
  background-color: #333744;
}
.el-main {
  background-color: #eaedf1;
}
</style>
