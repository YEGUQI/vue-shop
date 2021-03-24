<template>
  <div id="login_content">
    <LoginForm></LoginForm>
  </div>
</template>
<script>
import LoginForm from "./childComps/LoginForm"
export default {
  name: "Login",
  components: {
    LoginForm
  }
}
</script>

<style lang="less" scoped>
#login_content {
  background-color: #2b4b6b;
  height: 100%;
}
</style>
