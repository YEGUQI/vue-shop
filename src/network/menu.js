import { requset } from "./requset"
export function getMenuList() {
  return requset({
    method: "GET",
    url: "menus"
  })
}
