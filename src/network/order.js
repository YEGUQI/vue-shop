import { requset } from "./requset"
// 获取订单列表数据
export function getOrderList (info) {
  return requset({
    method: "GET",
    url: "/orders",
    params: info
  })
}

// 获取物流进度
export function getProgressInfo (id) {
  return requset({
    method: "GET",
    url: "/kuaidi/" + id
  })
}
