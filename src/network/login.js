import { requset } from "./requset"
export function postLogin(formInfo) {
  return requset({
    method: "POST",
    url: "login",
    data: {
      username: formInfo.username,
      password: formInfo.password
    }
  })
}
