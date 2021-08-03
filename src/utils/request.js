/*
 * @Descripttion:
 * @Author: sandro0618
 * @Date: 2021-07-13 17:07:23
 * @LastEditors: sandro0618
 * @LastEditTime: 2021-08-03 09:47:03
 */
import axios from 'axios'
axios.defaults.withCredentials = false
const service = axios.create({
  // baseURL: '/api'
})
export default service