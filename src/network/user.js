import { requset } from "./requset"

// 获取用户列表
export function getUserList (userInfo) {
  return requset({
    method: "GET",
    url: "/users",
    params: userInfo
  })
}

// 修改用户状态
export function putUserState (Stateinfo) {
  return requset({
    method: "PUT",
    url: `/users/${Stateinfo.id}/state/${Stateinfo.mg_state}`
  })
}

// 添加用户
export function postAdduser (adduserInfo) {
  return requset({
    method: "POST",
    url: "users",
    data: adduserInfo
  })
}

// 根据 id 查询用户信息
export function getQueryID (id) {
  return requset({
    method: "GET",
    url: "users/" + id
  })
}

// 提交修改后的用户信息
export function putUser (info) {
  return requset({
    method: "PUT",
    url: "users/" + info.id,
    data: info
  })
}

// 删除用户
export function deleteUser (id) {
  return requset({
    method: "delete",
    url: "users/" + id
  })
}

// 分配角色
export function putAllotRole (id, rid) {
  return requset({
    method: "PUT",
    url: `users/${id}/role`,
    data: { rid: rid }
  })
}
