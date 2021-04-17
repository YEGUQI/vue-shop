import axios from "axios"
import Nprogress from "nprogress"
export function requset(config) {
  const instance = axios.create({
    baseURL: "http://127.0.0.1:8888/api/private/v1/",
    timeout: 5000
  })
  // 配置请求拦截
  instance.interceptors.request.use(config => {
    // 进度条开始
    Nprogress.start()
    config.headers.Authorization = window.sessionStorage.getItem("token")

    return config
  })
  // 配置响应拦截
  instance.interceptors.response.use(config => {
    // 进度条结束
    Nprogress.done()
    return config
  })
  // 发送真正的网络请求
  return instance(config)
}
