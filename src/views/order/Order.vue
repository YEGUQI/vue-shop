<template>
  <div>
    <!-- 面包屑导航 -->
    <Breadcrumb>
      <template v-slot:title1>订单管理</template>
      <template v-slot:title2>订单列表</template>
    </Breadcrumb>
    <OrderList></OrderList>
  </div>
</template>

<script>
import Breadcrumb from "content/Breadcrumb.vue"
import OrderList from "./childComps/OrderList"
export default {
  name: "Order",
  components: { Breadcrumb, OrderList }
}
</script>

<style lang="less" scoped></style>
