<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><slot name="title1"></slot></el-breadcrumb-item>
      <el-breadcrumb-item><slot name="title2"></slot></el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {}
</script>
<style lang="less" scoped>
.el-breadcrumb {
  margin-bottom: 15px;
}
</style>
