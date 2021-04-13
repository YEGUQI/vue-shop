import { requset } from "../requset"
// 获取对应的参数数据
export function getParamsList (id, sel) {
  return requset({
    method: "GET",
    url: `categories/${id}/attributes/`,
    params: { sel: sel }
  })
}

// 添加动态/静态属性
export function postAddParams (id, paramsForm, attr_sel) {
  return requset({
    method: "POST",
    url: `categories/${id}/attributes`,
    data: {
      attr_name: paramsForm.attr_name,
      attr_sel: attr_sel
    }
  })
}

// 根据 id 查询动态/静态属性
export function getQuitParams (id, attrId) {
  return requset({
    method: "GET",
    url: `categories/${id}/attributes/${attrId}`
  })
}

// 提交修改后的动态/静态属性
export function putSubmitParams (id, paramsForm, attr_sel) {
  return requset({
    method: "PUT",
    url: `categories/${id}/attributes/${paramsForm.attr_id}`,
    data: {
      attr_name: paramsForm.attr_name,
      attr_sel: attr_sel ? attr_sel : paramsForm.attr_sel,
      attr_vals:
        typeof paramsForm.attr_vals === "string"
          ? paramsForm.attr_vals
          : paramsForm.attr_vals.join(" ")
    }
  })
}

// 删除动态/静态属性
export function deleteParams (id, attr_id) {
  return requset({
    method: "DELETE",
    url: `categories/${id}/attributes/${attr_id}`
  })
}
