import axios from 'axios'
import qs from 'qs'
import { store } from '@/store'
import { baseURLMap, urlModule } from './dict'
import { message } from 'ant-design-vue'
import i18n from '@/i18n/index'
import { showMsgWs } from '@/utils'
import { getErrorCode, logOutCode } from './const'
const apiUrl = baseURLMap[process.env.VUE_APP_MODE]
axios.defaults.baseURL = apiUrl
axios.defaults.timeout = 90000
const lang = localStorage.getItem('lang')

// 请求前request拦截器
axios.interceptors.request.use(
    config => {
        if (store.state.user) {
            config.headers.Authorization = store.state.user.token
        }
        config.headers.language = lang === 'zh-cn' ? '0' : '1'
        return config
    },
    err => {
        Promise.reject(err)
    }
)

// 响应后respone拦截器
axios.interceptors.response.use(
    async response => {
        let code = getErrorCode(response.data.code)
        if (response.config.responseType === 'blob') {
            return response
        } else if (Number(code) === 301018) {
            await store.dispatch('user/updatePermissions')
            return false
        } else if (Number(code) === 200) {
            return response.data.data
        } else if (logOutCode.includes(Number(code))) {
            showMsgWs({ content: i18n.global.t('common.code401') })
            store.dispatch('user/dispatchLogOut', true)
            return false
        } else {
            showMsgWs({ content: response.data.msg || 'Error 网络异常，请稍后重试' })
            return false
        }
    },
    async err => {
        message.error('Error 网络异常，请稍后重试')
        return false
    }
)
const setUrl = (url, module) => {
    return (url = module ? module + url : urlModule + url)
}
const http = {
    get (url, param, module) {
        // get请求
        return new Promise(resolve => {
            axios({
                method: 'get',
                url: setUrl(url, module),
                params: param
            }).then(res => {
                resolve(res)
            })
        })
    },
    postDocImgStream (url, param, module) {
        // posts请求 返回文件流和图片流使用
        return new Promise(resolve => {
            axios({
                method: 'post',
                responseType: 'blob',
                url: setUrl(url, module),
                data: param
            }).then(res => {
                resolve(res)
            })
        })
    },
    postForm (url, param, module) {
        // post请求 FormData请求方式
        return new Promise(resolve => {
            axios({
                method: 'post',
                url: setUrl(url, module),
                data: qs.stringify({ ...param })
            }).then(res => {
                resolve(res)
            })
        })
    },
    post (url, param, module) {
        // post请求 json请求方式
        return new Promise(resolve => {
            axios({
                method: 'post',
                url: setUrl(url, module),
                data: param
            }).then(res => {
                resolve(res)
            })
        })
    },
    put (url, param, module) {
        // put请求
        return new Promise(resolve => {
            axios({
                method: 'put',
                url: setUrl(url, module),
                data: qs.stringify(param)
            }).then(res => {
                resolve(res)
            })
        })
    },
    delete (url, param, module) {
        // put请求
        return new Promise(resolve => {
            axios({
                method: 'delete',
                url: setUrl(url, module),
                data: param
            }).then(res => {
                resolve(res)
            })
        })
    },
    base: axios
}
http.install = Vue => {
    Vue.prototype.$http = http
}
export default http
