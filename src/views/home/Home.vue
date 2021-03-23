<template>
  <div>
    <el-button @click="clearQuit">退出</el-button>
  </div>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {}
  },
  methods: {
    clearQuit() {
      window.sessionStorage.clear()
      this.$router.push("/login")
    }
  }
}
</script>

<style lang="less" scoped></style>
