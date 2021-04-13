import { requset } from "../requset"
// 添加角色
export function postAddRole (roleInfo) {
  return requset({
    method: "POST",
    url: "roles",
    data: roleInfo
  })
}

// 获取角色列表
export function getRoleList () {
  return requset({
    method: "GET",
    url: "roles"
  })
}

// 删除角色指定权限
export function deleteRightById (roleid, rightid) {
  return requset({
    method: "DELETE",
    url: `roles/${roleid}/rights/${rightid}`
  })
}

// 根据 id 查询角色
export function getSelectRoleById (id) {
  return requset({
    method: "GET",
    url: "roles/" + id
  })
}

// 提交修改后的角色信息
export function putEditRole (roleinfo) {
  return requset({
    method: "PUT",
    url: "roles/" + roleinfo.roleId,
    data: {
      roleName: roleinfo.roleName,
      roleDesc: roleinfo.roleDesc
    }
  })
}

// 删除角色
export function deleteRole (id) {
  return requset({
    method: "DELETE",
    url: "roles/" + id
  })
}

// 对角色进行授权
export function PostRoleAccredit (roleid, rids) {
  return requset({
    method: "POST",
    url: `roles/${roleid}/rights`,
    data: {
      rids: rids
    }
  })
}
