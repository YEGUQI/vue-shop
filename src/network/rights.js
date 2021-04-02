import { requset } from "./requset"
// 获取权限列表
export function getRightsList (type) {
  return requset({
    method: "GET",
    url: "rights/" + type
  })
}
