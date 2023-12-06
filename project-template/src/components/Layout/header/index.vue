<template>
    <a-layout-header class="odpm-header">
        <div class="layout-header-left"></div>
        <div class="layout-header-right">
            <iconpark-icon
                v-show="!flag"
                size="22"
                name="Frame1321315606"
                class="full-screen header-menu-item"
                @click="controlFullScreen"
            ></iconpark-icon>
            <iconpark-icon
                size="22"
                name="Frame1321315605"
                v-show="flag"
                class="full-screen header-menu-item"
                @click="controlFullScreen"
            ></iconpark-icon>
            <a-dropdown v-model:visible="visible">
                <span class="ant-dropdown-link header-menu-item" @click.prevent>
                    <span class="current-lang">
                        {{ langMap[locale] }}
                    </span>
                    <iconpark-icon name="Frame-1-7on38ohk"></iconpark-icon>
                </span>
                <template #overlay>
                    <a-menu @click="handleChangeLocale($event)">
                        <a-menu-item v-for="(lang, key) in langMap" :key="key">{{
                            lang
                        }}</a-menu-item>
                    </a-menu>
                </template>
            </a-dropdown>

            <div class="user-name-wrap header-menu-item">
                <iconpark-icon size="22" class="user-icon" name="Frame1321315282"></iconpark-icon>
                <a-tooltip class="user-inner">
                    <template #title>{{ computedUserName }}</template>
                    <span class="user-name">{{ computedUserName }}</span>
                </a-tooltip>
            </div>
            <iconpark-icon
                class="odpm-cursor exit-button header-menu-item"
                :size="22"
                name="Frame1321315607"
                @click="handleSignOut"
            ></iconpark-icon>
        </div>
    </a-layout-header>
</template>

<script setup>
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    DownOutlined,
    ExclamationCircleOutlined
} from '@ant-design/icons-vue'
import { controlFullScreen, listenFullScreen } from '@/utils'
// import { useLocale } from '@/i18n/useLocale'
import { store } from '@/store'
import { computed, ref, createVNode } from 'vue'
import { useI18n } from 'vue-i18n'
import { Modal } from 'ant-design-vue'

/** state */
const { t, locale } = useI18n()
const computedUserName = computed(() => store.state.user.userInfo.userName)
const flag = ref(false)
listenFullScreen(e => {
    const {
        fullscreenElement,
        webkitFullscreenElement,
        mozFullScreenElement,
        webkitIsFullScreen,
        mozFullScreen
    } = document

    const fullScreeningElement =
        fullscreenElement ||
        webkitFullscreenElement ||
        mozFullScreenElement ||
        webkitIsFullScreen ||
        mozFullScreen
    flag.value = !!fullScreeningElement
})
const visible = ref(false)
// const { changeLocale, getLocale } = useLocale()
const langMap = {
    'zh-cn': 'CN',
    'en-us': 'EN'
}

const handleSignOut = () => {
    Modal.confirm({
        title: t('common.modal.title'),
        icon: createVNode(ExclamationCircleOutlined),
        content: t('common.modal.modalContent'),
        okText: t('common.tobarText.yes'),
        cancelText: t('common.tobarText.no'),
        onOk() {
            handleOk()
        }
    })
}
const handleOk = async () => {
    await store.dispatch('user/dispatchLogOut', true)
}
const handleCancel = async () => {}
// 切换语言
const handleChangeLocale = e => {
    Modal.confirm({
        title: t('common.tobarText.tips'),
        icon: createVNode(ExclamationCircleOutlined),
        content: t('common.tobarText.pageLanguage'),
        okText: t('common.tobarText.yes'),
        cancelText: t('common.tobarText.no'),
        onOk() {
            localStorage.setItem('lang', e.key)
            location.reload()
            // changeLocale(e.key)
        }
    })
}
</script>

<style scoped lang="less"></style>
