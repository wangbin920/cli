import { message } from 'ant-design-vue'
import dayjs from 'dayjs'
// import { i18n } from '@/i18n'

/**
 * 获取localStorage
 */
export function getStore (key) {
    if (!key) return
    let result = window.localStorage.getItem(key)
    try {
        result = JSON.parse(result)
    } catch (err) { }
    if (result == null || result == undefined || result == '') {
        result = ''
    }
    return result
}

/**
 * 删除localStorage
 */
export function removeStore (key) {
    if (!key) return
    window.localStorage.removeItem(key)
}

/**
 * 存储localStorage
 */
export function setStore (key, content) {
    if (!key) return
    if (typeof content !== 'string') {
        content = JSON.stringify(content)
    }
    window.localStorage.setItem(key, content)
}

/**
 * @description 判读是否为外链
 * @param path
 * @returns {boolean}
 */
export function isExternal (path) {
    return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * 控制全屏
 */
export function controlFullScreen () {
    const {
        fullscreenElement,
        webkitFullscreenElement,
        mozFullScreenElement,
        webkitIsFullScreen,
        mozFullScreen,
        webkitExitFullscreen,
        mozCancelFullScreen,
        exitFullscreen,
        msRequestFullscreen
    } = document

    // 退出全屏的方法
    const exitFullscreenMethods = [
        webkitExitFullscreen,
        mozCancelFullScreen,
        exitFullscreen,
        msRequestFullscreen
    ]

    // 正在全屏的元素
    const fullScreeningElement =
        fullscreenElement ||
        webkitFullscreenElement ||
        mozFullScreenElement ||
        webkitIsFullScreen ||
        mozFullScreen
    if (fullScreeningElement) {
        // 退出全屏
        eachCompatibleMethod(exitFullscreenMethods, document)
    } else {
        // 全屏
        launchFullScreen()
    }
}

/**
 * 封装函数，控制全屏
 */
function launchFullScreen () {
    const { requestFullscreen, mozRequestFullScreen, webkitRequestFullScreen, msExitFullscreen } =
        document.documentElement
    const launchFullScreenMethods = [
        requestFullscreen,
        mozRequestFullScreen,
        webkitRequestFullScreen,
        msExitFullscreen
    ]
    eachCompatibleMethod(launchFullScreenMethods, document.documentElement)
}

/**
 * 遍历执行兼容的方法
 * @param {*} methodList 方法列表
 * @param {*} element 全屏元素
 */
function eachCompatibleMethod (methodList, element) {
    for (let i = 0; i < methodList.length; i++) {
        const method = methodList[i]
        if (method) {
            method.call(element)
            break
        }
    }
}

/**
 * 监听全屏状态变化
 */
export function listenFullScreen (callback) {
    const fullscreenChangeMethods = [
        'fullscreenchange',
        'webkitfullscreenchange',
        'mozfullscreenchange',
        'msfullscreenchange'
    ]
    fullscreenChangeMethods.forEach(method => {
        document.addEventListener(method, callback)
    })
}

/**
 *  只显示一次弹窗
 * @param {*} msg
 * @param {*} type
 * @param {*} customClass
 * @returns
 */
export const showMsgWs = ({
    content,
    type = 'error',
    duration = 3,
    icon,
    key,
    style,
    onClick,
    className = ''
}) => {
    if (window.messageStatus) {
        return
    }

    window.messageStatus = true
    let opt = {
        class: className,
        content,
        duration,
        icon,
        key,
        style,
        onClick,
        onClose: () => (window.messageStatus = false)
    }

    message[type](opt)
}

//获取url参数
export const parseUrlQuery = () => {
    let result = {}
    let url = window.location.href
    let query = url.split('?')[1]
    if (query) {
        let queryArr = query.split('&')
        queryArr.forEach(function (item) {
            let key = item.split('=')[0]
            result[key] = item.split('=')[1]
        })
    }
    return result
}

// 设置options
export function setSelectOptions (data, options, labelName, valueName) {
    options.value = data.reduce((prev, current) => {
        let { [labelName]: label, [valueName]: value } = current
        prev.push({ label, value })
        return prev
    }, [])
    return options.value
}

/**
 *  生成map
 * @param {*} data 源数据
 * @param {*} mapName 要赋值的响应式数据
 * @param {*} mapId 要映射作为key的字段名
 * @returns
 */
export const createMap = (data, mapName, mapId) => {
    mapName.value = data.reduce((prev, current) => {
        prev[current[mapId]] = current
        return prev
    }, {})
    return mapName.value
}

/**
 *  防抖
 * @param {*} fn 要执行的函数
 * @returns
 */
export const debounce = fn => {
    // loading状态
    let loading = null
    return async function () {
        try {
            if (loading) return
            loading = true

            // 改变this指向，如果fn是箭头函数，fn里面的this是指向其上层作用域的this, 并把参数传递给fn
            await fn.apply(this, arguments)
        } catch (error) {
            console.log(error)
        }
        loading = null
    }
}

// 日期范围限制为6个月的回调
export const halfYear = ({ diff }) => {
    let flag = diff > 180
    flag && showMsgWs({ type: 'warning', content: '起始时间和结束时间年限不能大于6个月' })
    return flag
}

/**
 * 日期范围发生变化的回调
 * @param {*} dates 日期数组
 * @param {*} modelRef 表单字段
 * @param {*} dateRanage string类型， 时间范围字段
 * @returns
 */
export const handleRangePickerChange = (dates, modelRef, dateRanage, fun) => {
    if (!dates) {
        modelRef[dateRanage] = []
        return false
    }

    let [startTime, endTime] = dates
    let diff = dayjs(endTime).diff(startTime, 'day')
    if (fun) {
        let flag = halfYear({ diff })
        if (flag) {
            return false
        }
    } else {
        if (diff > 365) {
            // showMsgWs({ type: 'warning', content: i18n.global.t('common.limitDateOneYear') })
            return false
        }
    }
    modelRef[dateRanage] = dates
    return true
}

// 不允许输入空格
export const handleInput = (e, attr, param) => {
    const value = e.target.value
    param[attr] = value.replace(/\s+/g, '')
}
