<template>
  <div>
    <Breadcrumb>
      <template v-slot:title1>
        商品管理
      </template>
      <template v-slot:title2>
        分类参数
      </template>
    </Breadcrumb>
    <ParamsContent></ParamsContent>
  </div>
</template>

<script>
import Breadcrumb from "content/Breadcrumb"
import ParamsContent from "./childComps/ParamsContent"
export default {
  name: "Params",
  components: {
    Breadcrumb,
    ParamsContent
  }
}
</script>

<style lang="less" scoped></style>
