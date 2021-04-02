<template>
  <div>
    <!-- 面包屑导航 -->
    <Breadcrumb>
      <template v-slot:title1>
        权限管理
      </template>
      <template v-slot:title2>
        角色列表
      </template>
    </Breadcrumb>
    <RoleContent />
  </div>
</template>

<script>
import Breadcrumb from "content/Breadcrumb.vue"

import RoleContent from "./childComps/RoleContent"
export default {
  name: "RoleList",
  components: { Breadcrumb, RoleContent }
}
</script>

<style lang="less" scoped></style>
