import { requset } from "../requset"
// 获取商品列表数据
export function getGoodList (queryInfo) {
  return requset({
    method: "GET",
    url: "goods/",
    params: queryInfo
  })
}

// 删除商品
export function deleteGoodsById (id) {
  return requset({
    method: "DELETE",
    url: "goods/" + id
  })
}

// 编辑商品
