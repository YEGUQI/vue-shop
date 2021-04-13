<template>
  <div>
    <el-card>
      <!-- 搜索框和添加商品按钮区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getGoodList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getGoodList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddGoods">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- 商品列表区域 -->
      <el-table :data="goodsList" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column
          label="商品价格(元)"
          prop="goods_price"
          width="95px"
        ></el-table-column>
        <el-table-column
          label="商品重量"
          prop="goods_weight"
          width="70px"
        ></el-table-column>
        <el-table-column label="创建时间" width="180px" prop="add_time">
          <template slot-scope="scope">{{
            scope.row.add_time | dataFormat
          }}</template>
        </el-table-column>
        <el-table-column label="操作" width="130px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteGoods(scope.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[10, 15, 25, 35]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { getGoodList, deleteGoodsById } from "network/goods/goodsList"

export default {
  name: "GoodsListContent",
  data() {
    return {
      queryInfo: {
        query: "",
        // 当前页码
        pagenum: 1,
        // 每页显示条数
        pagesize: 10
      },
      // 商品列表数据
      goodsList: [],
      total: 0
    }
  },
  created() {
    this.getGoodList()
  },
  methods: {
    // 获取商品列表数据
    async getGoodList() {
      const { data: result } = await getGoodList(this.queryInfo)
      if (result.meta.status !== 200) {
        this.$message.error("获取商品列表数据是失败")
      }
      this.goodsList = result.data.goods
      this.total = result.data.total
    },
    // 当前页面显示多少条数据
    handleSizeChange(newsize) {
      this.queryInfo.pagesize = newsize
      this.getGoodList()
    },
    // 当前的页码发生变化触发
    handleCurrentChange(newnum) {
      this.queryInfo.pagenum = newnum
      this.getGoodList()
    },
    // 删除商品
    async deleteGoods(id) {
      // 弹出警示框
      const confirmres = await this.$confirm(
        "此操作将永久删除该用户, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err)
      if (confirmres !== "confirm") {
        return this.$message.info("已取消删除操作")
      }
      const { data: result } = await deleteGoodsById(id)
      if (result.meta.status !== 200) {
        this.$message.error("删除商品失败")
      }
      this.$message.success("删除商品成功")
      this.getGoodList()
    },
    // 跳转到添加商品页面
    goAddGoods() {
      this.$router.push("goods/add")
    }
  }
}
</script>

<style lang="less" scoped>
.el-table {
  margin: 15px 0 15px 0;
}
</style>
