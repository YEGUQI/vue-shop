<template>
  <div>
    <Breadcrumb>
      <template v-slot:title1>数据统计</template>
      <template v-slot:title2>数据报表</template>
    </Breadcrumb>
    <ReportContent />
  </div>
</template>

<script>
import Breadcrumb from "content/Breadcrumb.vue"
import ReportContent from "./childComps/ReportContent"
export default {
  components: { Breadcrumb, ReportContent },
  name: "Report",
  data() {
    return {}
  },
  methods: {}
}
</script>

<style lang="less" scoped></style>
