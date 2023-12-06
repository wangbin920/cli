import { computed } from 'vue'
import dayjs from 'dayjs'
import i18n from '@/i18n'
import { store } from '@/store'
function t(text) {
    return i18n.global.t(text)
}
// 下载文件
export function downloadFileStream(fileStream, name, type = '') {
    const blob = new Blob([fileStream], { type })
    const fileName = `${name}`
    if ('download' in document.createElement('a')) {
        const elink = document.createElement('a')
        elink.download = fileName
        elink.style.display = 'none'
        elink.href = URL.createObjectURL(blob)
        document.body.appendChild(elink)
        elink.click()
        URL.revokeObjectURL(elink.href)
        document.body.removeChild(elink)
    } else {
        // 兼容IE10+下载
        navigator.msSaveBlob(blob, fileName)
    }
}

// 批量导入文件处理方法
export function importFiles(arr) {
    // 该函数用于将所有分区路由中的路由添加到路由数组
    const list = [] // 路由数组 - 存放所有路由
    arr.keys().forEach(key => {
        list.push(arr(key).default)
    })
    return list
}

// 批量导入文件处理方法-导入i18
export function importFilesForI18n(arr) {
    const obj = {}
    arr.keys().forEach(key => {
        obj[Object.keys(arr(key))[0]] = arr(key)[Object.keys(arr(key))[0]]
    })
    return obj
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

/**
 * 日期范围发生变化的回调
 * @param {*} dates 日期数组
 * @param {*} modelRef 表单字段
 * @param {*} dateRanage string类型， 时间范围字段
 * @returns
 */
export const handleRangePickerChange = (dates, modelRef, dateRanage, callback) => {
    if (!dates) {
        modelRef[dateRanage] = []
        callback && callback()
        return false
    }
    let [startTime, endTime] = dates
    let diff = startTime && endTime ? dayjs(endTime).diff(startTime, 'day') : 0
    if (diff > 365) {
        showMsgWs({ type: 'warning', content: t('common.limitDateOneYear') })
        return false
    } else {
        modelRef[dateRanage] = dates
        callback && callback()
        return true
    }
}

// 计算预设时间范围
export const computedPresetTimeRanges = computed(
    () =>
        (
            startTimeFormat = 'YYYY-MM-DD 00:00:00',
            endTimeFormat = 'YYYY-MM-DD 23:59:59',
            endTime
        ) => {
            // 默认结束时间是今天
            !endTime && (endTime = dayjs().format(endTimeFormat))

            return {
                // 今日
                0: {
                    startTime: dayjs().format(startTimeFormat),
                    endTime
                },

                // 近7日
                7: {
                    startTime: dayjs().subtract(6, 'day').format(startTimeFormat),
                    endTime
                },

                // 本月
                30: {
                    startTime: dayjs().startOf('month').format(startTimeFormat),
                    endTime: dayjs().endOf('month').format(endTimeFormat)
                },

                // 本年
                365: {
                    startTime: dayjs().startOf('year').format(startTimeFormat),
                    endTime: dayjs().endOf('year').format(endTimeFormat)
                },

                // 昨天
                yesterday: {
                    startTime: dayjs().subtract(1, 'day').endOf('day').format(startTimeFormat),
                    endTime: dayjs().subtract(1, 'day').endOf('day').format(endTimeFormat)
                }
            }
        }
)

//设置按钮权限
export const setBtnPermission = (tree, list) => {
    for (const node of tree) {
        if (node.moduleType === 2) {
            list.push(node)
        }
        if (node.treeNodeList) {
            const res = setBtnPermission(node.treeNodeList, list)
            if (res.moduleType === 2) {
                list.push(node)
            }
        }
    }
    return list
}

export const hasBtnPermission = computed(() => code => {
    if (store.state.user.btnPermission) {
        return store.state.user.btnPermission.find(v => v.permissionCode === code) ? true : false
    } else {
        return false
    }
})
//获取浏览器缩放比例
export const detectZoom = () => {
    // mac系统缩小20%
    if (isMac()) return 120

    var ratio = 0,
        screen = window.screen,
        ua = navigator.userAgent.toLowerCase()

    if (window.devicePixelRatio !== undefined) {
        ratio = window.devicePixelRatio
    } else if (~ua.indexOf('msie')) {
        if (screen.deviceXDPI && screen.logicalXDPI) {
            ratio = screen.deviceXDPI / screen.logicalXDPI
        }
    } else if (window.outerWidth !== undefined && window.innerWidth !== undefined) {
        ratio = window.outerWidth / window.innerWidth
    }

    if (ratio) {
        ratio = Math.round(ratio * 100)
    }
    return ratio
}
/**
 * 判断是否为mac系统
 * @returns
 */
export const isMac = function () {
    return /macintosh|mac os x/i.test(navigator.userAgent)
}
//修改对应的浏览器缩放比例
export const getZoom = () => {
    let ratio = (100 / detectZoom()) * 100 //比例
    return {
        bodyZoom: `${ratio}%`, //body比例
        floatBodyZoom: ratio / 100,
        echartsZoom: detectZoom() > 100 ? 100 / ratio : '100%' //echarts比例
    }
}
