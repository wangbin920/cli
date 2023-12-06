import { createApp } from 'vue'
import Antd from 'ant-design-vue/es'
import App from './App.vue'
import { store } from './store'
import VuewechatTitle from 'vue-wechat-title'
import i18n from './i18n'
import router from './router'
import { menuFieldsList, menuFieldsSave } from './api/common'
import { opGlobalConfig } from 'op-template'

import './utils/http'

// 全局调整atd部分样式
// import 'ant-design-vue/dist/antd.css'
import 'ant-design-vue/dist/antd.less'
import '@/assets/style/common.less'
import '@/assets/style/theme.less'
import 'op-template/src/assets/style/global.less'

//注入全局属性$message
import { message } from 'ant-design-vue'

opGlobalConfig.tableConfig({
    showListSetting: true,
    menuFieldsList,
    menuFieldsSave
})

message.config({
    duration: 2, // 持续时间
    maxCount: 1 // 最大显示数, 超过限制时，最早的消息会被自动关闭
})

const app = createApp(App)
app.use(store).use(Antd).use(router).use(i18n).use(VuewechatTitle).mount('#app')
