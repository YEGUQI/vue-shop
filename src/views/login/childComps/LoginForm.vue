<template>
  <div class="login_box">
    <!-- 头像区域 -->
    <div class="avater_box">
      <img src="~assets/logo.png" alt="" />
    </div>
    <!-- 登录表单区域 -->
    <el-form
      :model="formInfo"
      label-width="0px"
      class="login_form"
      :rules="loginFormRuls"
      ref="loginFormRef"
    >
      <!-- 用户名 -->
      <el-form-item prop="username">
        <el-input
          prefix-icon="el-icon-user-solid"
          v-model="formInfo.username"
        ></el-input>
      </el-form-item>
      <!-- 密码 -->
      <el-form-item prop="password">
        <el-input
          prefix-icon="el-icon-lock"
          v-model="formInfo.password"
          type="password"
        ></el-input>
      </el-form-item>
      <!-- 按钮区域 -->
      <el-form-item class="btns">
        <el-button type="primary" @click="loginClick">登录</el-button>
        <el-button type="info" @click="resetClick">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { postLogin } from "network/login.js"
export default {
  name: "Login",
  data() {
    return {
      // 表单数据
      formInfo: {
        username: "admin",
        password: "123456"
      },
      // 表单校验规则
      loginFormRuls: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 2, max: 8, message: "长度在 2 到 8 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 16, message: "长度在 6 到 16 个字符", trigger: "blur" }
        ]
      }
    }
  },
  methods: {
    // 重置表单数据
    resetClick() {
      // 对表单的验证规则和内容进行重置
      this.$refs.loginFormRef.resetFields()
    },
    // 登录并验证
    loginClick() {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) {
          return false
        }
        const { data: result } = await postLogin(this.formInfo)
        // 根据状态码判断登录是否成功
        if (result.meta.status !== 200) {
          return this.$message.error("登录失败")
        }
        this.$message.success("登录成功")
        // 登录成功 将从服务器返回的 token 值保存到客户端 sessionStorage 中
        // 项目中除了登录之外的 API 接口，必须要在登录以后才能访问
        // token 只应在网页打开期间生效 所以保存到 sessionStorage 中
        window.sessionStorage.setItem("token", result.data.token)
        // 登录成功跳转到首页
        this.$router.push("/home")
      })
    }
  }
}
</script>
<style lang="less" scoped>
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border-radius: 5px;
}
.avater_box {
  width: 130px;
  height: 130px;
  background-color: #fff;
  border: 1px solid #eee;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 0 10px #ddd;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    border: 1px solid #eee;
  }
}
.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 15px;
  box-sizing: border-box;
}
.btns {
  display: flex;
  justify-content: center;
}
</style>
