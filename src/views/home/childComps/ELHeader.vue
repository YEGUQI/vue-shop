<template>
  <el-header>
    <div>
      <img src="~assets/img/heima.png" alt="" />
      <span>电商后台管理系统</span>
    </div>
    <el-button @click="clearQuit">退出</el-button>
  </el-header>
</template>

<script>
export default {
  name: "ELHeader",
  methods: {
    clearQuit() {
      window.sessionStorage.clear()
      this.$router.push("/login")
    }
  }
}
</script>

<style lang="less" scoped>
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 0px;
  color: #fff;
  padding-right: 5px;
  > div {
    display: flex;
    align-items: center;
    > span {
      margin-left: 10px;
    }
  }
}
</style>
