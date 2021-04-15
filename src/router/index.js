import Vue from "vue"
import VueRouter from "vue-router"

const Login = () => import("views/login/Login")
const Home = () => import("home/Home")
const Welcome = () => import("home/childComps/Welcome")
const Users = () => import("user/User")
const Rights = () => import("rights/Rights")
const RoleList = () => import("roleList/RoleList")
const Cate = () => import("cate/Cate")
const Params = () => import("params/Params")
const GoodsList = () => import("goodsList/GoodsList")
const AddGoods = () => import("goodsList/childComps/AddGoods")
const Report = () => import("report/Report")

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
