import { requset } from "./requset"
export function getReports () {
  return requset({
    method: "GET",
    url: "reports/type/1"
  })
}
