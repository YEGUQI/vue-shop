<template>
  <div>
    <el-card>
      <!-- 搜索框与添加按钮区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <!-- 搜索框 -->
          <el-input
            placeholder="请输入内容"
            v-model="userInfo.query"
            clearable
            @clear="getuserData"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getuserData"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <!-- 添加用户按钮 -->
          <el-button type="primary" @click="addUserDialog = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>

      <!--用户列表区域-->
      <el-table :data="userList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="userStateChange(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteUserClick(scope.row.id)"
            ></el-button>
            <!-- 文字提示框 -->
            <el-tooltip
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <!-- 分配角色按钮 -->
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="showAllotRoleDialog(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="userInfo.pagenum"
        :page-sizes="[5, 10, 15, 30]"
        :page-size="userInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加用户对话框 -->
    <el-dialog
      :visible.sync="addUserDialog"
      width="50%"
      title="添加用户"
      @close="addDialogClose"
    >
      <!-- 内容主体区域 -->
      <el-form
        :model="addForm"
        :rules="addFormrules"
        ref="addForm"
        label-width="100px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model.number="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addUserDialog = false">取 消</el-button>
        <el-button type="primary" @click="addUserClick">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户对话框 -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%">
      <!-- 主体内容区域 -->
      <el-form
        ref="editFormref"
        :model="editUserInfo"
        label-width="80px"
        :rules="addFormrules"
      >
        <el-form-item label="用户名">
          <el-input v-model="editUserInfo.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editUserInfo.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editUserInfo.mobile"></el-input>
        </el-form-item>
      </el-form>

      <!-- 按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限对话框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="allotRoleDialogVisible"
      width="50%"
      @close="clearselectRoleId"
    >
      <p>当前用户：{{ userdata.username }}</p>
      <p>当前角色：{{ userdata.role_name }}</p>
      <p>分配新角色：</p>
      <el-select v-model="selectRoleId" placeholder="请选择">
        <el-option
          v-for="item in roleList"
          :key="item.id"
          :label="item.roleName"
          :value="item.id"
        >
        </el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="AllotRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getUserList,
  putUserState,
  postAdduser,
  getQueryID,
  putUser,
  deleteUser,
  putAllotRole
  // <!-- putAllotRole -->
} from "network/user.js"
import { getRoleList } from "network/power/role.js"
export default {
  data() {
    // 自定义邮箱验证规则
    var checkEmail = (rule, val, cb) => {
      const regEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      if (regEmail.test(val)) {
        return cb()
      }
      cb(new Error("请输入正确的邮箱"))
    }
    // 自定义手机号码验证规则
    var checkMobile = (rule, val, cb) => {
      const regMobile = /^(?:(?:\+|00)86)?1[3-9]\d{9}$/
      if (regMobile.test(val)) {
        return cb()
      }
      cb(new Error("请输入正确的邮箱"))
    }
    return {
      // 用户列表初始信息
      userInfo: {
        query: "",
        // 当前的页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 5
      },
      // 当前用户信息
      userdata: {},
      // 用户列表数据
      userList: [],
      // 角色列表
      roleList: {},
      // 总数据条数
      total: 0,
      // 选中的角色的id
      selectRoleId: "",
      // 控制添加用户对话框的显示与隐藏
      addUserDialog: false,
      // 控制修改用户对话框的显示与隐藏
      editDialogVisible: false,
      // 分配角色对话框的显示与隐藏
      allotRoleDialogVisible: false,
      // 添加用户的表单数据
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      // 修改用户的表单数据
      editUserInfo: {},
      // 添加用户的表单验证规则
      addFormrules: {
        username: [
          { required: true, trigger: "blur", message: "请输入用户名" },
          {
            min: 3,
            max: 6,
            trigger: "blur",
            message: "用户名的长度在2到6个字符"
          }
        ],
        password: [
          { required: true, trigger: "blur", message: "请输入密码" },
          {
            min: 6,
            max: 12,
            trigger: "blur",
            message: "密码的长度在2到6个字符"
          }
        ],
        email: [
          { required: true, trigger: "blur", message: "请输入密码" },
          {
            validator: checkEmail,
            message: "请输入正确的邮箱地址",
            trigger: "blur"
          }
        ],
        mobile: [
          { required: true, trigger: "blur", message: "请输入手机号码" },
          {
            validator: checkMobile,
            message: "请输入正确的手机号码",
            trigger: "blur"
          }
        ]
      },
      // 修改用户的表单验证规则
      editFormrules: {
        email: [
          { required: true, trigger: "blur", message: "请输入邮箱" },
          {
            validator: checkEmail,
            message: "请输入正确的邮箱地址",
            trigger: "blur"
          }
        ],
        mobile: [
          { required: true, trigger: "blur", message: "请输入手机号码" },
          {
            validator: checkMobile,
            message: "请输入正确的手机号码",
            trigger: "blur"
          }
        ]
      }
    }
  },
  created() {
    // 获取用户列表数据
    this.getuserData()
  },
  methods: {
    // 获取用户列表数据
    async getuserData() {
      const { data: result } = await getUserList(this.userInfo)
      if (result.meta.status !== 200)
        return this.$message.error(result.meta.msg)
      this.userList = result.data.users
      this.total = result.data.total
    },
    // 当前页面显示多少条数据
    handleSizeChange(newsize) {
      this.userInfo.pagesize = newsize
      this.getuserData()
    },
    // 当前的页码发生变化触发
    handleCurrentChange(pagenum) {
      this.userInfo.pagenum = pagenum
      this.getuserData()
    },
    // 更新用户状态
    async userStateChange(Stateinfo) {
      const { data: result } = await putUserState(Stateinfo)
      if (result.meta.status !== 200) {
        Stateinfo.mg_state = !Stateinfo.mg_state
        return this.$message.error("更新用户状态失败")
      }
      this.$message.success("更新用户状态成功")
    },
    // 监听添加用户对话框的关闭事件
    addDialogClose() {
      // 对话框关闭 重置表单
      this.$refs.addForm.resetFields()
    },
    // 添加用户
    addUserClick() {
      this.$refs.addForm.validate(async valid => {
        if (!valid) return false
        const { data: result } = await postAdduser(this.addForm)
        if (result.meta.status !== 201) {
          return this.$message.error(result.meta.msg)
        }
        this.$message.success("添加用户成功")
        // 关闭添加用户对话框
        this.addUserDialog = false
        // 重新获取用户列表数据
        this.getuserData()
      })
    },
    // 获取修改的用户信息
    async showEditDialog(id) {
      this.editDialogVisible = true
      const { data: result } = await getQueryID(id)
      if (result.meta.status !== 200) {
        return this.$message.error("获取用户信息失败")
      }
      this.editUserInfo = result.data
    },
    // 修改用户
    editUser() {
      // 对修改表单中的数据进行预验证
      this.$refs.editFormref.validate(async valid => {
        if (!valid) return false
        const { data: result } = await putUser(this.editUserInfo)
        if (result.meta.status !== 200) {
          return this.$message.error("修改用户信息失败")
        }
        this.$message.success("修改用户信息成功")
        // 重新获取用户列表
        this.getuserData()
        // 关闭对话框
        this.editDialogVisible = false
      })
    },
    // 删除用户
    async deleteUserClick(id) {
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
      // 发送删除请求
      const { data: result } = await deleteUser(id)
      if (result.meta.status !== 200) {
        return this.$message.error("删除用户失败")
      }
      this.$message.success("删除用户成功")
      // 重新获取用户列表
      this.getuserData()
    },
    // 显示分配角色对话框 并获取角色信息
    async showAllotRoleDialog(userinfo) {
      this.userdata = userinfo
      this.allotRoleDialogVisible = true
      const { data: result } = await getRoleList()
      this.roleList = result.data
    },
    // 分配角色
    async AllotRole() {
      const { data: result } = await putAllotRole(
        this.userdata.id,
        this.selectRoleId
      )
      if (result.meta.status !== 200) {
        return this.$message.error("分配角色失败")
      }
      this.$message.success("分配角色成功")
      this.getuserData()
      this.allotRoleDialogVisible = false
    },
    // 分配角色对话框关闭 清除 selectRoleId
    clearselectRoleId() {
      this.selectRoleId = ""
    }
  }
}
</script>

<style lang="less" scoped>
.el-card {
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15);
}
.el-table {
  margin-top: 15px;
}
</style>
