<template>
  <div>
    <!-- 面包屑导航 -->
    <Breadcrumb>
      <template v-slot:title1>
        商品管理
      </template>
      <template v-slot:title2>
        添加商品
      </template>
    </Breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 警示信息区域 -->
      <el-alert
        title="添加商品信息"
        type="info"
        :closable="false"
        center
        show-icon
      >
      </el-alert>
      <!-- 步骤条区域 -->
      <el-steps
        :space="200"
        :active="activeIndex - 0"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- 标签页区域 -->
      <el-form
        :model="addGoodsForm"
        :rules="addGoodsrules"
        ref="addGoodsRef"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          v-model="activeIndex"
          :tab-position="'left'"
          :before-leave="beforeTabLeave"
          @tab-click="TabClick"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addGoodsForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input
                v-model="addGoodsForm.goods_price"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_number">
              <el-input
                v-model="addGoodsForm.goods_number"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_weight">
              <el-input
                v-model="addGoodsForm.goods_weight"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_weight">
              <!-- options 指定数据源 -->
              <!-- props用来执行配置对象 -->
              <el-cascader
                v-model="addGoodsForm.goods_cat"
                :options="cateList"
                :props="cascaderProps"
                @change="handleChange"
                clearable
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              :label="item.attr_name"
              v-for="item in manyTabList"
              :key="item.attr_id"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  :label="lab"
                  v-for="(lab, i) in item.attr_vals"
                  :key="i"
                  border
                ></el-checkbox></el-checkbox-group
            ></el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :label="item.attr_name"
              v-for="item in onlyTabList"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3"
            ><el-upload
              :action="uploadUrl"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="uploadheaders"
              :on-success="uploadSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload></el-tab-pane
          >
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addGoodsForm.goods_introduce"></quill-editor>
            <el-button type="primary" @click="addGoods" class="btn"
              >添加商品</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 图片预览对话框 -->
    <el-dialog
      title="图片预览"
      :visible.sync="previewDialogVisible"
      width="30%"
    >
      <img :src="previewUrl" alt="" class="previewImg" />
    </el-dialog>
  </div>
</template>

<script>
import Breadcrumb from "content/Breadcrumb"

import _ from "lodash"

import { getCateList } from "network/goods/goodsCate"
import { getParamsList } from "network/goods/goodsParams"
import { addGoods } from "network/goods/addGoods"
export default {
  name: "AddGoods",
  components: {
    Breadcrumb
  },
  data() {
    return {
      activeIndex: "0",
      // 添加商品表单数据
      addGoodsForm: {
        goods_name: "",
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        // 商品所属的分类数组
        goods_cat: [],
        // 上传的图片
        pics: [],
        // 商品介绍
        goods_introduce: "",
        //商品的参数(动态参数/静态属性)
        attrs: []
      },
      // 添加商品表单验证规则
      addGoodsrules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" }
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" }
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" }
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" }
        ]
      },
      // 商品分类数据
      cateList: [],
      selectKeys: [],
      // 指定级联选择器的配置对象
      cascaderProps: {
        expandTrigger: "hover",
        value: "cat_id",
        label: "cat_name",
        children: "children"
        // multiple: true
        // checkStrictly: true
      },
      // 动态参数列表
      manyTabList: [],
      // 静态属性列表
      onlyTabList: [],
      // 上传图片的路径
      uploadUrl: "http://127.0.0.1:8888/api/private/v1/upload",
      // 上传图片的请求头对象
      uploadheaders: {
        Authorization: window.sessionStorage.getItem("token")
      },
      // 预览图片的路径
      previewUrl: "",
      // 图片预览对话框的显示与隐藏
      previewDialogVisible: false
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 获取商品分类列表
    async getCateList() {
      const { data: result } = await getCateList()
      if (result.meta.status !== 200) {
        return this.$message.error("获取商品分类数据失败")
      }
      this.cateList = result.data
    },
    // 级联选择器选中项发生变化时触发
    handleChange() {
      // 让级联选择框只准选中三级分类
      if (this.addGoodsForm.goods_cat.length !== 3) {
        this.addGoodsForm.goods_cat = []
      }
    },
    // 当标签页切换时 触发
    beforeTabLeave(activeName, oldActiveName) {
      if (oldActiveName === "0" && this.addGoodsForm.goods_cat.length !== 3) {
        this.$message.error("请先选择商品分类")
        return false
      }
    },
    // 点击 切换标签页时触发
    async TabClick() {
      // 点击 商品参数时触发
      if (this.activeIndex === "1") {
        const { data: result } = await getParamsList(this.cateID, "many")
        if (result.meta.status !== 200) {
          this.$message.error("获取参数列表失败")
        }
        // 将字符串参数转变成数组
        result.data.forEach(item => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(" ")
        })
        this.manyTabList = result.data
      }
      // 点击 商品属性时触发
      if (this.activeIndex === "2") {
        const { data: result } = await getParamsList(this.cateID, "only")
        if (result.meta.status !== 200) {
          this.$message.error("获取参数列表失败")
        }
        this.onlyTabList = result.data
      }
    },
    // 处理图片的预览效果的钩子函数
    handlePreview(file) {
      this.previewUrl = file.response.data.url
      this.previewDialogVisible = true
    },
    // 移除图片的钩子函数
    handleRemove(file) {
      // 获取图片的临时路径
      const resPath = file.response.data.tmp_path
      // 根据图片的临时路径获取 addGoodsform.pisc 中对应的索引
      const index = this.addGoodsForm.pics.findIndex(i => i.pics === resPath)
      // 根据索引删除对应的临时路径
      this.addGoodsForm.pics.splice(index, 1)
    },
    // 图片上传成功的钩子函数
    uploadSuccess(response) {
      const resPath = response.data.tmp_path
      this.addGoodsForm.pics.push(resPath)
    },
    // 添加商品
    addGoods() {
      this.$refs.addGoodsRef.validate(async valid => {
        if (!valid) {
          return this.$message.error("请填写必要的信息")
        }
        // 对原数据进行 深拷贝
        const addForm = _.cloneDeep(this.addGoodsForm)
        // 对深拷贝的数据进行修改
        addForm.goods_cat = addForm.goods_cat.join(",")
        // 处理动态参数
        this.manyTabList.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(" ")
          }
          this.addGoodsForm.attrs.push(newInfo)
        })
        // 处理静态属性
        this.onlyTabList.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          this.addGoodsForm.attrs.push(newInfo)
        })
        addForm.attrs = this.addGoodsForm.attrs
        // 发送添加商品请求
        const { data: result } = await addGoods(addForm)
        console.log(result)
        if (result.meta.status !== 201) {
          return this.$message.error("添加商品失败")
        }
        this.$message.success("添加商品成功")
        // 跳转到商品列表页面
        this.$router.push("/goods")
      })
    }
  },
  computed: {
    // 返回分类 ID
    cateID() {
      if (this.addGoodsForm.goods_cat.length === 3) {
        return this.addGoodsForm.goods_cat[2]
      }
      return null
    }
  }
}
</script>

<style lang="less" scoped>
.el-steps {
  margin: 15px 0 15px 0;
}
.el-cascader {
  width: 28%;
}
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
.previewImg {
  width: 100%;
}
.btn {
  margin-top: 15px;
}
</style>
