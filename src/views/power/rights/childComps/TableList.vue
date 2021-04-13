<template>
  <el-card>
    <el-table :data="rightList" border stripe>
      <el-table-column type="index"></el-table-column>
      <el-table-column label="权限名称" prop="authName"></el-table-column>
      <el-table-column label="路径" prop="path"></el-table-column>
      <el-table-column label="权限等级">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.level === '0'">一级权限</el-tag>
          <el-tag v-if="scope.row.level === '1'" type="success"
            >二级权限</el-tag
          >
          <el-tag v-if="scope.row.level === '2'" type="warning"
            >三级权限</el-tag
          >
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
import { getRightsList } from "network/power/rights"
export default {
  name: "TableList",
  data() {
    return {
      rightList: []
    }
  },
  created() {
    this.getRightList()
  },
  methods: {
    // 获取权限列表
    async getRightList() {
      const { data: result } = await getRightsList("list")
      this.rightList = result.data
    }
  }
}
</script>

<style lang="less" scoped></style>
