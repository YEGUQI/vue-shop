<template>
  <div>
    <el-card>
      <!-- 搜索框区域 -->
      <el-row>
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="ordersInfo.query"
            clearable
            @clear="getOrderList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getOrderList"
            ></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- 订单列表区域 -->
      <el-table :data="ordersList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="order_number" label="订单编号"></el-table-column>
        <el-table-column
          prop="order_price"
          label="订单价格"
          width="100px"
        ></el-table-column>
        <el-table-column prop="order_pay" label="是否付款" width="100px">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.roworder_pay === '1'"
              >已付款</el-tag
            >
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="is_send"
          label="是否发货"
          width="100px"
        ></el-table-column>
        <el-table-column prop="create_time" label="下单时间" width="180px">
          <template slot-scope="scope">
            {{ scope.row.create_time | dataFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130px">
          <template>
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="showEditAddress"
            ></el-button
            ><el-button
              size="mini"
              type="success"
              icon="el-icon-location"
              @click="showprogress"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="ordersInfo.pagenum"
        :page-sizes="[10, 15, 25, 35]"
        :page-size="ordersInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      >
      </el-pagination>
    </el-card>
    <!-- 修改订单地址对话框 -->
    <el-dialog
      title="修改地址"
      :visible.sync="editAddressDialogVisible"
      width="50%"
      @close="editAddressClose"
    >
      <el-form
        :model="editAddressForm"
        :rules="editAddressRules"
        ref="editAddressRef"
        label-width="100px"
      >
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader
            v-model="editAddressForm.address1"
            :options="citydata"
            :props="{ expandTrigger: 'hover' }"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="editAddressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editAddressDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editAddressDialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 查看物流信息对话框 -->
    <el-dialog
      title="物流进度"
      :visible.sync="progressDialogVisible"
      width="50%"
    >
      <el-timeline :reverse="true">
        <el-timeline-item
          v-for="(activity, index) in progressData"
          :key="index"
          :timestamp="activity.time"
        >
          {{ activity.context }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import { getOrderList, getProgressInfo } from "network/order"

import citydata from "@/common/citydata"
export default {
  name: "OrderList",
  data() {
    return {
      ordersInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10
      },
      // 总数据条数
      total: 0,
      // 订单列表数据
      ordersList: [],
      // 省市区/县联动数据
      citydata,
      // 控制修改订单地址对话框的显示与隐藏
      editAddressDialogVisible: false,
      // 控制物流进度框的显示与隐藏
      progressDialogVisible: false,
      // 修改订单地址的数据绑定对象
      editAddressForm: {
        address1: [],
        address2: ""
      },
      // 修改订单地址表单的验证规则
      editAddressRules: {
        address1: [
          { required: true, message: "请输入省市区/县", trigger: "blur" }
        ],
        address2: [
          { required: true, message: "请输入详细地址", trigger: "blur" }
        ]
      },
      progressData: []
    }
  },
  created() {
    this.getOrderList()
  },
  methods: {
    // 获取订单列表数据
    async getOrderList() {
      const { data: result } = await getOrderList(this.ordersInfo)
      if (result.meta.status !== 200) {
        return this.$message.error("获取订单列表失败")
      }
      this.ordersList = result.data.goods
      this.total = result.data.total
    },
    // 当前页面显示多少条数据
    handleSizeChange(newSize) {
      this.ordersInfo.pagesize = newSize
      this.getOrderList()
    },
    // 当前的页码发生变化触发
    handleCurrentChange(newNum) {
      this.ordersInfo.pagenum = newNum
      this.getOrderList()
    },
    // 显示修改地址对话框
    showEditAddress() {
      this.editAddressDialogVisible = true
    },
    // 监听修改地址对话框关闭事件
    editAddressClose() {
      this.$refs.editAddressRef.resetFields()
    },
    async showprogress() {
      const { data: result } = await getProgressInfo("4313714213586")
      this.progressDialogVisible = true
      if (result.meta.status !== 200) {
        return this.$error("获取物流信息失败")
      }
      this.progressData = result.data
    }
  }
}
</script>

<style lang="less" scoped>
.el-table {
  margin-bottom: 15px;
}
.el-cascader {
  width: 100%;
}
</style>
