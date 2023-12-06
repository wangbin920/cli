<template>
    <a-config-provider :locale="locale">
        <router-view v-wechat-title="odpmTitle" />
    </a-config-provider>
</template>

<script setup>
// import { useLocale } from '@/i18n/useLocale'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ref, nextTick, watchEffect, computed } from 'vue'
import dayjs from 'dayjs'
import { detectZoom, getZoom } from '@/utils/common.js'
import { parseUrlQuery, getStore, setStore } from '@/utils'
import { store } from '@/store'
import 'dayjs/locale/zh-cn'
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
import enUS from 'ant-design-vue/es/locale/en_US'
dayjs.locale('zh-cn')

const { t } = useI18n()
// const { getAntdLocale } = useLocale()
const router = useRouter()
const route = useRoute()
const odpmTitle = ref('') // 获取自定义title
const size = ref('small') // 全局设置 antd 组件大小

watchEffect(() => {
    if (
        router &&
        router.currentRoute &&
        router.currentRoute.value &&
        router.currentRoute.value.path
    ) {
        nextTick(() => {
            let title = router.currentRoute.value.meta.title
            title && (odpmTitle.value = t(title))
        })
    }
})
const locale = ref(localStorage.getItem('lang') === 'en-us' ? enUS : zhCN) // 判断使用组件国际化
//如果缩放比例大于100 就缩小
if (detectZoom() > 100) {
    let { bodyZoom } = getZoom()
    if (document.documentElement) {
        document.documentElement.style.zoom = bodyZoom
    } else {
        document.body.style.zoom = bodyZoom
    }
}
// 获取请求用户信息接口的参数---token和systemId
const getUserInfoParams = () => {
    // 解析url传过来的参数, 并存入localstorage
    let params = parseUrlQuery()
    let { token, systemId } = params
    if (token) {
        setStore('token', token)
        store.dispatch('user/dispatchToken', token)
    }

    if (systemId) {
        setStore('systemId', systemId)
        return { systemId }
    }

    // 先获取localstorage中有没有参数
    let systemIdParams = getStore('systemId')
    if (systemIdParams) {
        return {
            systemId: systemIdParams
        }
    }
}

// 获取用户信息
const queryUserInfo = async () => {
    try {
        await store.dispatch('user/dispatchUserInfo', getUserInfoParams())
        if (window.location.pathname === '/' || window.location.pathname === '/dashboard') {
            let url = getStore('menuTree')[0].treeNodeList[0].permissionCode
            url = url[0] === '/' ? url : '/' + url
            router.replace(url)
        }
    } catch (error) {
        console.log(error)
    }
}

queryUserInfo()
</script>

<style lang="less">
html,
body,
#app {
    height: 100%;
    overflow: auto;
}
body {
    background-color: #edeff3 !important;
}
</style>
