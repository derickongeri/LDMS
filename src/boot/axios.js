import Vue from 'vue'
import axios from 'axios'

let base;
if (process.env.DEV) {
    // base = 'steve'
    // base= 'http://10.1.60.103:1337' //synology
    // base= 'http://172.105.246.124/' 
    base= 'http://41.227.30.139:1337/' //synology
  }
  else {
    
    // base= 'http://172.105.246.124/' //linode
    // base= 'http://10.1.60.103:1337' //synology
    base= 'http://41.227.30.139:1337/' //synology
  }
const axiosInstance = axios.create({
    baseURL: base // production
})
Vue.prototype.$axios = axiosInstance
export { axiosInstance }