<template>
  <div>
    <!-- 面包屑导航 -->
    <Breadcrumb>
      <template v-slot:title1>用户管理</template>
      <template v-slot:title2>用户列表</template>
    </Breadcrumb>
    <!-- 内容主体区域 -->
    <Content></Content>
  </div>
</template>

<script>
import Breadcrumb from "content/Breadcrumb"

import Content from "user/childComps/Content.vue"
export default {
  components: {
    Breadcrumb,
    Content
  },
  data() {
    return {}
  }
}
</script>

<style lang="less" scoped></style>
