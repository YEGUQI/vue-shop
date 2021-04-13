<template>
  <div>
    <Breadcrumb>
      <template v-slot:title1>
        商品管理
      </template>
      <template v-slot:title2>
        商品列表
      </template>
    </Breadcrumb>
    <GoodsListContent />
  </div>
</template>

<script>
import Breadcrumb from "content/Breadcrumb"
import GoodsListContent from "./childComps/GoodsListContent"
export default {
  name: "GoodsList",
  components: {
    Breadcrumb,
    GoodsListContent
  }
}
</script>

<style lang="less" scoped></style>
