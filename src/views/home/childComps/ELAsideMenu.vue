<template>
  <el-aside :width="iscollapse ? '64px' : '200px'">
    <div class="toggle-button" @click="toggleClick">|||</div>
    <el-menu
      background-color="#333744"
      text-color="#fff"
      active-text-color="#409BFF"
      :unique-opened="true"
      :collapse="iscollapse"
      :collapse-transition="false"
      :router="true"
      :default-active="activePath"
    >
      <!-- 一级菜单 -->
      <el-submenu
        :index="item.id + ''"
        v-for="item in menuList.data"
        :key="item.id"
      >
        <!-- 一级菜单的模板区域 -->
        <template slot="title">
          <!-- 图标 -->
          <i :class="iconsObj[item.id]"></i>
          <!-- 文本内容 -->
          <span>{{ item.authName }}</span>
        </template>
        <!-- 二级菜单 -->
        <el-menu-item
          :index="'/' + itemT.path"
          v-for="itemT in item.children"
          :key="itemT.id"
          @click="saveState('/' + itemT.path)"
        >
          <!-- 二级菜单的模板区域 -->
          <template slot="title">
            <!-- 图标 -->
            <i class="el-icon-menu"></i>
            <!-- 文本内容 -->
            <span>{{ itemT.authName }}</span>
          </template>
        </el-menu-item>
      </el-submenu>
    </el-menu>
  </el-aside>
</template>

<script>
import { getMenuList } from "network/menu.js"
export default {
  name: "ELAsideMenu",
  data() {
    return {
      menuList: [],
      iconsObj: {
        "125": "iconfont icon-users",
        "103": "iconfont icon-tijikongjian",
        "101": "iconfont icon-shangpin",
        "102": "iconfont icon-danju",
        "145": "iconfont icon-baobiao"
      },
      iscollapse: false,
      activePath: ""
    }
  },
  created() {
    // 请求菜单数据
    this.menulist()
    //将二级菜单链接状态 赋值给 activePath
    this.activePath = window.sessionStorage.getItem("activeState")
  },
  methods: {
    // 请求菜单数据数据
    async menulist() {
      const result = await getMenuList().then(res => {
        return res.data
      })
      if (result.meta.status !== 200)
        return this.$message.error(result.meta.msg)
      this.menuList = result
    },
    // 点击收起左侧菜单
    toggleClick() {
      this.iscollapse = !this.iscollapse
    },
    // 保存二级菜单链接状态
    saveState(activePath) {
      window.sessionStorage.setItem("activeState", activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style lang="less" scoped>
.iconfont {
  margin-right: 8px;
}
.el-menu {
  border-right: none;
}
.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  cursor: pointer;
  text-align: center;
  letter-spacing: 0.2em;
}
</style>
