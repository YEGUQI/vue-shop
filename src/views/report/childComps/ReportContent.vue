<template>
  <div>
    <el-card>
      <div id="main" style="width: 750px;height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
import echarts from "echarts"
import _ from "lodash"
import { getReports } from "network/report"
export default {
  name: "ReportContent",
  data() {
    return {
      options: {
        title: {
          text: "用户来源"
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#E9EEF3"
            }
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: "value"
          }
        ]
      }
    }
  },
  async mounted() {
    var myChart = echarts.init(document.getElementById("main"))
    // 获取报表数据
    const { data: result } = await getReports()
    if (result.meta.status !== 200) {
      this.$message.error("获取报表信息失败")
    }
    // 将报表信息和 options 进行合并
    const res = _.merge(result.data, this.options)
    myChart.setOption(res)
  }
}
</script>

<style lang="less" scoped></style>
