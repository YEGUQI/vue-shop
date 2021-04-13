<template>
  <div>
    <el-card>
      <!-- 添加角色按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addRoledialogVisible = true"
            >添加角色</el-button
          >
        </el-col>
      </el-row>

      <!-- 角色列表区域 -->
      <el-table :data="rolesListInfo" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['bottombd', i1 === 0 ? 'topbd' : '', 'vcenter']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag
                  closable
                  @close="deleteRightById(scope.row, item1.id)"
                  >{{ item1.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级和三级权限 -->
              <el-col :span="19">
                <el-row
                  :class="[i2 === 0 ? 'bottombd' : '', 'vcenter']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                >
                  <!-- 二级权限 -->
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="deleteRightById(scope.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级权限 -->
                  <el-col :span="18">
                    <el-tag
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      type="warning"
                      closable
                      @close="deleteRightById(scope.row, item3.id)"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              class="el-icon-edit"
              @click="editRoleinfo(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              class="el-icon-delete"
              @click="deleteRoleById(scope.row.id)"
              >删除</el-button
            >
            <el-button
              size="mini"
              type="warning"
              class="el-icon-setting"
              @click="showAllotRoledialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加角色对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addRoledialogVisible"
      width="50%"
      @close="clearaddform"
    >
      <el-form
        :model="addRoleForm"
        :rules="addRolerules"
        ref="ruleForm"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="addRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRoledialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑用户对话框 -->
    <el-dialog
      title="编辑角色"
      :visible.sync="editRoledialogVisible"
      width="50%"
    >
      <el-form
        :model="editRoleForm"
        :rules="editRolerules"
        ref="ruleForm"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="editRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRoledialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRole">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限对话框 -->
    <el-dialog
      title="编辑角色"
      :visible.sync="allotRoledialogVisible"
      width="40%"
      @close="clearKeys"
    >
      <el-tree
        :data="rightsList"
        :props="rightProps"
        ref="treeRights"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defkeys"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="allotRoledialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  postAddRole,
  getRoleList,
  deleteRightById,
  getSelectRoleById,
  putEditRole,
  deleteRole,
  PostRoleAccredit
} from "network/power/role"
import { getRightsList } from "network/power/rights"

export default {
  name: "RoleContent",
  data() {
    return {
      // 控制添加角色表单的显示与隐藏
      addRoledialogVisible: false,
      // 控制修改角色表单的显示与隐藏
      editRoledialogVisible: false,
      // 分配权限对话框的显示与隐藏
      allotRoledialogVisible: false,
      // 添加角色的信息
      addRoleForm: {
        roleName: "",
        roleDesc: ""
      },
      // 修改角色的信息
      editRoleForm: {
        roleName: "",
        roleDesc: ""
      },
      // 角色列表信息
      rolesListInfo: [],
      // 添加角色表单的验证规则
      addRolerules: {
        roleName: [
          { required: true, trigger: "blur", message: "请输入角色名称" }
        ]
      },
      // 修改角色表单的验证规则
      editRolerules: {
        roleName: [
          { required: true, trigger: "blur", message: "请输入角色名称" }
        ]
      },
      // 所有权限列表
      rightsList: "",
      // 树形控件的属性绑定
      rightProps: {
        label: "authName",
        children: "children"
      },
      // 默认选中的的权限的 id
      defkeys: []
    }
  },
  created() {
    // 获取角色列表
    this.rolesList()
  },
  methods: {
    // *获取角色列表
    async rolesList() {
      const { data: result } = await getRoleList()
      if (result.meta.status !== 200) {
        return this.$message.error("获取角色列表失败")
      }
      this.rolesListInfo = result.data
      this.$message.success("获取角色列表成功")
    },
    // ?添加角色
    async addRole() {
      const { data: result } = await postAddRole(this.addRoleForm)
      if (result.meta.status !== 201) {
        return this.$message.error("添加角色失败")
      }
      this.$message.success("添加角色成功")
      this.rolesList()
      this.addRoledialogVisible = false
    },
    // ?添加角色对话框关闭 后清空表单中的内容
    clearaddform() {
      this.$refs.ruleForm.resetFields()
      this.addRoleForm = {}
    },
    // !删除角色下的指定权限
    async deleteRightById(role, right) {
      // 弹出警示框
      const confirmres = await this.$confirm(
        "此操作将永久删除该权限, 是否继续?",
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
      const { data: result } = await deleteRightById(role.id, right)
      // 只对部分数据重新赋值 避免整个页面的刷线
      role.children = result.data
    },
    // *获取要修改的角色的信息
    async editRoleinfo(id) {
      const { data: result } = await getSelectRoleById(id)
      if (result.meta.status !== 200) {
        return this.$message.error("获取角色信息失败")
      }
      this.editRoleForm = result.data
      this.editRoledialogVisible = true
    },
    // ?提交修改后角色信息
    async editRole() {
      const { data: result } = await putEditRole(this.editRoleForm)
      if (result.meta.status !== 200) {
        return this.$message.error("修改角色信息失败")
      }
      this.$message.success("修改角色信息成功")
      // 重新获取角色列表
      this.rolesList()
      // 关闭对话框
      this.editRoledialogVisible = false
    },
    // !删除角色
    async deleteRoleById(id) {
      // 弹出警示框
      const confirmres = await this.$confirm(
        "此操作将永久删除该角色, 是否继续?",
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
      const { data: result } = await deleteRole(id)
      if (result.meta.status != 200) {
        this.$message.error("删除角色失败")
      }
      this.$message.success("删除角色成功")
      // 重新获取角色列表
      this.rolesList()
    },
    // *获取所有权限 并显示分配权限对话框
    async showAllotRoledialog(role) {
      this.roleid = role.id
      const { data: result } = await getRightsList("tree")
      if (result.meta.status !== 200) {
        return this.$message.error("获取权限列表失败")
      }
      this.rightsList = result.data
      // 通过递归的方式 获取 已经被选中的 三级权限的 id
      this.getSelectRoleId(role, this.defkeys)
      this.allotRoledialogVisible = true
    },
    //! 分配角色权限
    async allotRole() {
      const keys = [
        ...this.$refs.treeRights.getCheckedKeys(),
        ...this.$refs.treeRights.getHalfCheckedKeys()
      ]
      const idStr = keys.join(",")
      const { data: result } = await PostRoleAccredit(this.roleid, idStr)
      if (result.meta.status !== 200) {
        return this.$message.error("分配权限失败")
      }
      this.$message.success("分配权限成功")
      // 重新获取角色列表数据
      this.rolesList()
      this.allotRoledialogVisible = false
    },
    // ?通过递归的方式 获取所有已经被选中的 三级权限的 id
    getSelectRoleId(node, arr) {
      // 三级权限是最底层的 所有没有 children
      if (!node.children) {
        // 将三级权限的 id 添加到数组中
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this.getSelectRoleId(item, arr)
      })
    },
    // ?分配权限对话框关闭 清空 defkeys数组中的内容
    clearKeys() {
      this.defkeys = []
    }
  }
}
</script>

<style lang="less" scoped>
.el-table {
  margin-top: 15px;
}
.el-tag {
  margin: 7px;
}
.topbd {
  border-top: 1px solid #eee;
}
.bottombd {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
