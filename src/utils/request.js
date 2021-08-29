import axios from 'axios'
axios.defaults.withCredentials = false
const service = axios.create({
  // baseURL: '/api'
})
export default service