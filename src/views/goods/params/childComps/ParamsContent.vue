<template>
  <div>
    <el-card>
      <!-- 警示信息 -->
      <el-alert
        title="注意：只允许为第三级分类设置相关参数"
        type="warning"
        show-icon
        :closable="false"
      >
      </el-alert>

      <!--级联选择框 -->
      <el-row>
        <el-col class="spn">
          <span>选择商品分类：</span>
          <el-cascader
            v-model="selectKeys"
            :options="cateList"
            :props="cascaderProps"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>

      <!-- tabs标签页 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            size="mini"
            :disabled="isDisableButton"
            @click="showAddParamsdialog"
            >添加参数</el-button
          >
          <!-- table 表格 -->
          <el-table border stripe :data="manyTableData">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  @close="closeHandleTag(index, scope.row)"
                  >{{ item }}</el-tag
                >
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditParamsdialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="deleteParams(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            size="mini"
            :disabled="isDisableButton"
            @click="showAddParamsdialog"
            >添加属性</el-button
          >
          <!-- table 表格 -->
          <el-table border stripe :data="onlyTableData">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  @close="closeHandleTag(index, scope.row)"
                  >{{ item }}</el-tag
                >
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column
              label="属性名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditParamsdialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="deleteParams(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加属性/参数对话框 -->
    <el-dialog
      :title="'添加' + showAddParamsDialogTitle"
      :visible.sync="addParamsDialogVisible"
      width="50%"
      @close="closeaddParamsDialog"
    >
      <el-form
        ref="addParamsform"
        :model="addParamsform"
        label-width="80px"
        :rules="addParamsrules"
      >
        <el-form-item :label="showAddParamsDialogTitle" prop="attr_name">
          <el-input v-model="addParamsform.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addParamsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改属性/参数对话框 -->
    <el-dialog
      :title="'修改' + showAddParamsDialogTitle"
      :visible.sync="editParamsDialogVisible"
      width="50%"
    >
      <el-form
        ref="editParamsformref"
        :model="editParamsform"
        label-width="80px"
        :rules="editParamsrules"
      >
        <el-form-item :label="showAddParamsDialogTitle" prop="attr_name">
          <el-input v-model="editParamsform.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editParamsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getCateList } from "network/goods/goodsCate"
import {
  getParamsList,
  postAddParams,
  getQuitParams,
  putSubmitParams,
  deleteParams
} from "network/goods/goodsParams"
export default {
  name: "ParamsContent",
  data() {
    return {
      // 商品分类数据
      cateList: [],
      // 级联选择框的配置项
      cascaderProps: {
        expandTrigger: "hover",
        value: "cat_id",
        label: "cat_name",
        children: "children"
      },
      // 级联选择框选中的数据
      selectKeys: [],
      //当前 tabs标签页
      activeName: "many",
      // 动态参数
      manyTableData: [],
      // 静态属性
      onlyTableData: [],
      // 控制添加参数/属性对话框的显示与隐藏
      addParamsDialogVisible: false,
      // 控制修改参数/属性对话框的显示与隐藏
      editParamsDialogVisible: false,
      // 添加参数的表单数据
      addParamsform: {
        attr_name: ""
      },
      // 添加参数表单的验证规则
      addParamsrules: {
        attr_name: [
          {
            required: true,
            message: "参数/属性不能为空",
            trigger: "blur"
          }
        ]
      },
      // 修改参数的表单数据
      editParamsform: {
        attr_name: "",
        attr_id: null
      },
      // 修改参数表单的验证规则
      editParamsrules: {
        attr_name: [
          {
            required: true,
            message: "参数/属性不能为空",
            trigger: "blur"
          }
        ]
      }
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 获取商品分类数据
    async getCateList() {
      const { data: result } = await getCateList({ type: 3 })
      if (result.meta.status !== 200) {
        this.$message.eror("获取分类参数失败")
      }
      this.cateList = result.data
    },
    // 监听 级联选择框 变化的事件
    handleChange() {
      this.getParamsList()
    },
    //  监听 tabs标签页 变化 的事件
    handleClick() {
      this.getParamsList()
    },
    // 获取参数列表数据
    async getParamsList() {
      if (this.selectKeys.length !== 3) {
        this.selectKeys = []
        this.manyTableData = []
        this.onlyTableData = []
        return false
      }
      const { data: result } = await getParamsList(
        this.activeCateID,
        this.activeName
      )
      if (result.meta.status !== 200) {
        return this.$message.error("获取数据失败")
      }
      // 将字符串参数转变成数组
      result.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : []
        // 控制文本框的显示与隐藏
        item.inputVisible = false
        item.inputValue = ""
      })
      if (this.activeName === "many") {
        return (this.manyTableData = result.data)
      }
      this.onlyTableData = result.data
    },
    //  显示添加参数/属性对话框
    showAddParamsdialog() {
      this.addParamsDialogVisible = true
    },
    //  添加参数/属性
    addParams() {
      // 对表单进行预验证
      this.$refs.addParamsform.validate(async valid => {
        if (!valid) {
          return false
        }
        const { data: result } = await postAddParams(
          this.activeCateID,
          this.addParamsform,
          this.activeName
        )
        if (result.meta.status !== 201) {
          return this.$message.error(
            "'添加'+this.showAddParamsDialogTitle+'失败'"
          )
        }
        this.$message.success("添加成功")
        this.getParamsList()
        this.addParamsDialogVisible = false
      })
    },
    // 监听添加参数/属性对话框的关闭事件
    closeaddParamsDialog() {
      // 清空表单
      this.$refs.addParamsform.resetFields()
    },
    // 显示修改参数/属性对话框
    async showEditParamsdialog(attrid) {
      // 根据 id 查询对应信息
      const { data: result } = await getQuitParams(this.activeCateID, attrid)
      if (result.meta.status !== 200) {
        this.$message.error("获取参数/属性信息失败")
      }
      this.editParamsform = result.data
      this.editParamsDialogVisible = true
    },
    // 提交修改后的参数/属性信息
    editParams() {
      this.$refs.editParamsformref.validate(async valid => {
        if (!valid) {
          return false
        }
        const { data: result } = await putSubmitParams(
          this.activeCateID,
          this.editParamsform,
          this.activeName
        )
        if (result.meta.status !== 200) {
          return this.$message.error("更新失败")
        }
        this.$message.success("更新成功")
        this.getParamsList()
        this.editParamsDialogVisible = false
      })
    },
    // 删除 参数/属性
    async deleteParams(attrid) {
      // 弹出警示框
      const confirmres = await this.$confirm(
        "此操作将永久删除该参数, 是否继续?",
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
      const { data: reuslt } = await deleteParams(this.activeCateID, attrid)
      if (reuslt.meta.status !== 200) {
        return this.$message.error("删除参数成功")
      }
      this.$message.success("删除参数成功")
      this.getParamsList()
    },
    // 当文本框失去焦点 或者按下了Enter键触发
    async handleInputConfirm(row) {
      // 隐藏输入框
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ""
        row.inputVisible = false
        return false
      }
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ""
      row.inputVisible = false
      const { data: result } = await putSubmitParams(this.activeCateID, row)
      console.log(result)
      if (result.meta.status !== 200) {
        return this.$message.error("修改参数项失败")
      }
      this.$message.success("修改参数项成功")
    },
    showInput(row) {
      // 显示输入框
      row.inputVisible = true
      // 让文本框获得焦点
      // nextTick 当页面上的元素重新渲染以后 执行回调函数中的代码
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 监听 tag 标签的关闭事件
    async closeHandleTag(i, row) {
      row.attr_vals.splice(i, 1)
      const { data: result } = await putSubmitParams(this.activeCateID, row)
      console.log(result)
      if (result.meta.status !== 200) {
        return this.$message.error("修改参数项失败")
      }
      this.$message.success("修改参数项成功")
    }
  },
  computed: {
    // 是否启用添加参数/属性按钮
    isDisableButton() {
      if (this.selectKeys.length !== 3) {
        return true
      }
      return false
    },
    // 返回当前分类的id
    activeCateID() {
      if (this.selectKeys.length === 3) {
        return this.selectKeys[this.selectKeys.length - 1]
      }
      return null
    },
    // 显示添加参数/属性对话框的标题
    showAddParamsDialogTitle() {
      if (this.activeName === "many") {
        return "动态参数"
      }
      return "静态属性"
    }
  }
}
</script>

<style lang="less" scoped>
.spn {
  margin-top: 15px;
}
.el-cascader {
  width: 25%;
}
.el-table {
  margin-top: 15px;
}
.input-new-tag {
  width: 120px;
}
.el-tag {
  margin: 0 20px 0 0;
}
</style>
