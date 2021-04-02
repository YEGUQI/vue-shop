<template>
  <div>
    <!-- 面包屑导航 -->
    <Breadcrumb>
      <template v-slot:title1>
        权限管理
      </template>
      <template v-slot:title2>
        权限列表
      </template>
    </Breadcrumb>
    <!-- 权限列表 -->
    <TableList />
  </div>
</template>

<script>
import Breadcrumb from "content/Breadcrumb"

import TableList from "./childComps/TableList"
export default {
  name: "Rigths",
  components: {
    Breadcrumb,
    TableList
  }
}
</script>
<style lang="less" scoped></style>
