<template>
  <div>
    <el-card>
      <!-- 添加分类按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="showCateDialog">添加分类</el-button>
        </el-col>
      </el-row>

      <!-- tab表格 -->
      <tree-table
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        class="treeTable"
      >
        <!-- 是否有效  列-->
        <template slot="isOk" slot-scope="scope">
          <i
            class="el-icon-circle-check"
            v-if="scope.row.cat_deleted === false"
            style="color:lightgreen"
          ></i>
          <i v-else class="el-icon-circle-close" style="color:red"></i>
        </template>
        <!-- 排序 列-->
        <template slot="sort" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" v-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag type="warning" v-if="scope.row.cat_level === 2">三级</el-tag>
        </template>
        <!-- 操作 列 -->
        <template slot="opt" slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-edit"
            @click="showEditCateDialog(scope.row.cat_id)"
            >编辑</el-button
          >
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="deleteCate(scope.row.cat_id)"
            >删除</el-button
          >
        </template>
      </tree-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querinfo.pagenum"
        :page-sizes="[10, 15, 20, 30]"
        :page-size="querinfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="clearCateFormInfo"
    >
      <el-form
        ref="addCateref"
        :model="addCateform"
        :rules="addCaterules"
        label-width="80px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateform.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <!-- options 指定数据源 -->
          <!-- props用来执行配置对象 -->
          <el-cascader
            v-model="selectKeys"
            :options="parentCateInfo"
            :props="cascaderProps"
            @change="handleChange"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改分类对话框 -->
    <el-dialog
      title="修改分类"
      :visible.sync="editCateDialogVisible"
      width="50%"
    >
      <el-form
        ref="editCateRef"
        :model="editCateForm"
        label-width="80px"
        :rules="editCaterules"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getCateList,
  postaddCate,
  getQueryCateByid,
  putCate,
  deleteCateByid
} from "network/goods/goodsCate"
export default {
  name: "CateContent",
  data() {
    return {
      // 查询参数
      querinfo: {
        type: 3,
        // 当前页码值
        pagenum: 1,
        //每页显示多少条数据
        pagesize: 10
      },
      // 总数据条数
      total: 0,
      // 控制添加分类表单的显示与隐藏
      addCateDialogVisible: false,
      // 控制修改分类表单的显示与隐藏
      editCateDialogVisible: false,
      // 分类列表数据
      cateList: [],
      // tree-table 列的配置
      columns: [
        {
          label: "分类名称",
          prop: "cat_name"
        },
        {
          label: "是否有效",
          // 表示将当前这一列定义为模板
          type: "template",
          // 表示当前这一列使用的模板名称
          template: "isOk"
        },
        {
          label: "排序",
          // 表示将当前这一列定义为模板
          type: "template",
          // 表示当前这一列使用的模板名称
          template: "sort"
        },
        {
          label: "操作",
          // 表示将当前这一列定义为模板
          type: "template",
          // 表示当前这一列使用的模板名称
          template: "opt"
        }
      ],
      // 添加分类表单验证规则
      addCaterules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" }
        ]
      },
      // 修改分类表单验证规则
      editCaterules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" }
        ]
      },
      // 添加分类表单数据
      addCateform: {
        cat_name: "",
        cat_pid: 0,
        cat_level: 0
      },
      //父级分类数据
      parentCateInfo: [],
      // 指定级联选择器的配置对象
      cascaderProps: {
        expandTrigger: "hover",
        value: "cat_pid",
        label: "cat_name",
        children: "children"
        // multiple: true
        // checkStrictly: true
      },
      // 选中的父级分类 id 数组
      selectKeys: [],
      // 修改分类表单数据
      editCateForm: {
        cat_name: "",
        cat_pid: 0
      }
    }
  },
  created() {
    // 获取商品列表
    this.getCateList()
  },
  methods: {
    // 获取商品分类列表
    async getCateList() {
      const { data: result } = await getCateList(this.querinfo)
      if (result.meta.status !== 200) {
        return this.$message.error("获取商品分类数据失败")
      }
      this.cateList = result.data.result
      this.total = result.data.total
    },
    // 监听 pagesize 的改变
    handleSizeChange(newseze) {
      this.querinfo.pagesize = newseze
      this.getCateList()
    },
    // 监听 pagenum 的改变
    handleCurrentChange(newnum) {
      this.querinfo.pagenum = newnum
      this.getCateList()
    },
    // 显示添加分类对话框
    async showCateDialog() {
      const { data: result } = await getCateList({ type: 2 })
      if (result.meta.status !== 200) {
        this.$message.error("获取父级分类数据失败")
      }
      this.parentCateInfo = result.data
      this.addCateDialogVisible = true
    },
    // 当级联选择框发生变化时 更新表单中的数据
    handleChange() {
      if (this.selectKeys.length > 0) {
        // 父级分类的id
        this.addCateform.cat_pid = this.selectKeys[this.selectKeys.length - 1]
        //为当前分类的等级赋值
        this.addCateform.cat_level = this.selectKeys.length
        return
      } else {
        this.addCateform.cat_pid = 0
        this.addCateform.cat_level = 0
      }
    },
    // 监听添加分类对话框的关闭事件
    clearCateFormInfo() {
      this.$refs.addCateref.resetFields()
      this.selectKeys = []
      this.addCateform.cat_pid = 0
      this.addCateform.cat_level = 0
    },
    // 添加分类
    addCate() {
      this.$refs.addCateref.validate(async valid => {
        if (!valid) {
          return false
        }
        const { data: result } = await postaddCate(this.addCateform)
        if (result.meta.status !== 201) {
          return this.$message.error("添加分类失败")
        }
        this.$message.success("添加分类成功")
        this.getCateList()
        this.addCateDialogVisible = false
      })
    },
    // 显示修改分类对话框
    async showEditCateDialog(id) {
      // 根据 id 查询对应分类的信息
      const { data: result } = await getQueryCateByid(id)
      this.editCateForm = result.data
      this.editCateDialogVisible = true
    },
    // 提交修改后的分类信息
    editCate() {
      // 对修改分类表单进行预验证
      this.$refs.editCateRef.validate(async valid => {
        if (!valid) {
          return false
        }
        const { data: result } = await putCate(this.editCateForm)
        if (result.meta.status !== 200) {
          return this.$message.error("修改分类失败")
        }
        this.$message.success("修改分类成功")
        this.getCateList()
        this.editCateDialogVisible = false
      })
    },
    // 根据 id 删除分类
    async deleteCate(id) {
      // 弹出警示框
      const confirmres = await this.$confirm(
        "此操作将永久删除该分类, 是否继续?",
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
      const { data: result } = await deleteCateByid(id)
      if (result.meta.status !== 200) {
        this.$message.error("删除分类失败")
      }
      this.$message.success("删除分类成功")
      this.getCateList()
    }
  }
}
</script>

<style lang="less" scoped>
.treeTable {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>
