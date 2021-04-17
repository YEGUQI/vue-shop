import { requset } from "../requset"
// 添加商品
export function addGoods(goodsInfo) {
  return requset({
    method: "post",
    url: "goods",
    data: goodsInfo
  })
}
