import { requset } from "../requset"
// 获取分类列表
export function getCateList(querinfo) {
  return requset({
    method: "GET",
    url: "categories",
    params: querinfo ? querinfo : null
  })
}

// 添加分类
export function postaddCate(cateinfo) {
  return requset({
    method: "POST",
    url: "categories",
    data: cateinfo
  })
}

// 根据 id 查询分类
export function getQueryCateByid(id) {
  return requset({
    method: "GET",
    url: "categories/" + id
  })
}

// 编辑提交分类
export function putCate(editCatrinfo) {
  return requset({
    method: "put",
    url: "categories/" + editCatrinfo.cat_id,
    data: { cat_name: editCatrinfo.cat_name }
  })
}

// 根据 id 删除分类
export function deleteCateByid(id) {
  return requset({
    method: "delete",
    url: "categories/" + id
  })
}
