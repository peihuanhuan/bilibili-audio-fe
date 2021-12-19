import ajax from '@/uni_modules/u-ajax/js_sdk'
import Vue from 'vue'

// 创建实例
const instance = ajax.create({
  baseURL: process.uniEnv.VUE_APP_BASE_API
})



instance.interceptors.request.use(
  config => {
	const token = Vue.$cookies.get("token")
	config.header.common["Authorization"] = 'Bearer ' + token
    return config
  },
  error => {
    // 对请求错误做些什么
	console.log(error)
    return Promise.reject(error)
  }
)

instance.interceptors.response.use(
  response => {
    // if (response.data.code !== 200) {
    //   uni.showToast({
    //     title: response.data.msg,
    //     icon: 'none'
    //   })
    // }
    return response.data
  },
  error => {
    // 对响应错误做些什么
	console.log(error)
    return Promise.reject(error)
  }
)


// 导出创建后的实例
export default instance
