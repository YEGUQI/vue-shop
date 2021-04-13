<template>
  <div>
    <Breadcrumb>
      <template v-slot:title1>
        商品管理
      </template>
      <template v-slot:title2>
        商品分类
      </template>
    </Breadcrumb>
    <CateContent />
  </div>
</template>

<script>
import Breadcrumb from "content/Breadcrumb"
import CateContent from "./childComps/CateContent.vue"
export default {
  name: "Cate",
  components: {
    Breadcrumb,
    CateContent
  },
  data() {
    return {}
  }
}
</script>

<style lang="less" scoped></style>
