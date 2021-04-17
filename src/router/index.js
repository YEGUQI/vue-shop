import Vue from "vue"
import VueRouter from "vue-router"

const Login = () =>
  import(/* webpackChunkName: "Login_Home_Welcome" */ "views/login/Login")
const Home = () =>
  import(/* webpackChunkName: "Login_Home_Welcome" */ "home/Home")
const Welcome = () =>
  import(/* webpackChunkName: "Login_Home_Welcome" */ "home/childComps/Welcome")
const Users = () => import(/* webpackChunkName: "User" */ "user/User")
const Rights = () =>
  import(/* webpackChunkName: "Rights_RoleList" */ "rights/Rights")
const RoleList = () =>
  import(/* webpackChunkName: "Rights_RoleList" */ "roleList/RoleList")
const Cate = () =>
  import(/* webpackChunkName: "GoodsList_Cate_Params_AddGoods" */ "cate/Cate")
const Params = () =>
  import(
    /* webpackChunkName: "GoodsList_Cate_Params_AddGood"s */ "params/Params"
  )
const GoodsList = () =>
  import(
    /* webpackChunkName: "GoodsList_Cate_Params_AddGoods" */ "goodsList/GoodsList"
  )
const AddGoods = () =>
  import(
    /* webpackChunkName: "GoodsList_Cate_Params_AddGoods */ "goodsList/childComps/AddGoods"
  )
const Order = () => import(/* webpackChunkName: "Order" */ "order/Order")
const Report = () => import(/* webpackChunkName: "Report" */ "report/Report")

Vue.use(VueRouter)

const routes = [
  { path: "/", redirect: "/login " },
  { path: "/login", component: Login },
  {
    path: "/home",
    component: Home,
    redirect: "/Welcome",
    children: [
      { path: "/welcome", component: Welcome },
      { path: "/users", component: Users },
      { path: "/rights", component: Rights },
      { path: "/roles", component: RoleList },
      { path: "/categories", component: Cate },
      { path: "/params", component: Params },
      { path: "/goods", component: GoodsList },
      { path: "/goods/add", component: AddGoods },
      { path: "/orders", component: Order },
      { path: "/reports", component: Report }
    ]
  }
]

const router = new VueRouter({
  mode: "history",
  routes
})

// 导航守卫
// to 将要访问的页面。 from 从哪里来。 next 放行
router.beforeEach((to, from, next) => {
  // 判断当前所处的页面是否为 登录页 如果是则 next
  if (to.path === "/login") return next()
  // 取出客户端的 token
  const token = window.sessionStorage.getItem("token")
  // 判断 token 中是否有值 没有则返回登录页面
  if (!token) return next("/login")
  // 如果 token 中有值 则直接放行
  next()
})
export default router
