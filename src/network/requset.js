import axios from "axios"
export function requset (config) {
  const instance = axios.create({
    baseURL: "http://127.0.0.1:8888/api/private/v1/",
    timeout: 5000
  })
  // 配置请求拦截
  instance.interceptors.request.use(config => {
    config.headers.Authorization = window.sessionStorage.getItem("token")
    return config
  })
  // 发送真正的网络请求
  return instance(config)
}
