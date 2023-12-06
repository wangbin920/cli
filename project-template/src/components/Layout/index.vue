<template>
    <div>
        <BasicHeader
            :userName="computedUserName"
            :getLocale="locale"
            :handleChangeLocale="handleChangeLocale"
            :handleSignOut="handleSignOut"
        />
        <BasicMenu :permissionMenu="setMenuList(permissionMenuList)">
            <div class="odpm-content">
                <BreadList />
                <router-view v-slot="{ Component }" :style="minHeight">
                    <transition name="fade-slide" mode="out-in" appear>
                        <!-- <keep-alive> -->
                        <component :is="Component" />
                        <!-- </keep-alive> -->
                    </transition>
                </router-view>
                <div class="copyright">
                    {{ computedCopyrightText }}
                </div>
            </div>
        </BasicMenu>
    </div>
</template>
<script setup>
import { computed, ref, watch, createVNode } from 'vue'
import { useRoute } from 'vue-router'
import BreadList from '@/components/breadList/index.vue'
import Menus from '../menu/menus.vue'
import { detectZoom, getZoom } from '@/utils/common.js'
import LayoutHeader from './header'
import './index.less'
import { getStore } from '@/utils'
import { useStore } from 'vuex'
import { BasicHeader, BasicMenu } from 'op-template'
import { useI18n } from 'vue-i18n'
import { Modal } from 'ant-design-vue'
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'

/** state */
const { t, locale } = useI18n()
const route = useRoute()
const selectedKeys = ref([''])
const openKeys = ref([''])
const collapsed = ref(false)
const store = useStore()

const computedCopyrightText = computed(
    () => `Copyright Oceanpayment © 2014-${new Date().getFullYear()}`
)
const computedUserName = computed(() => store.state.user.userInfo.userName)
/** methods */
// 收起或展开
const minHeight = ref('min-height: calc(100vh - 260px)')
//如果缩放比例大于100 就缩小
if (detectZoom() > 100) {
    let { floatBodyZoom } = getZoom()
    minHeight.value = `min-height: calc(100vh / ${floatBodyZoom} - 260px)`
}
const permissionMenuList = computed(() => {
    try {
        return store.state.user.menuTree.treeNodeList
    } catch (error) {
        return []
    }
})

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
        }
    })
}
const handleSignOut = () => {
    Modal.confirm({
        title: t('common.modal.title'),
        icon: createVNode(ExclamationCircleOutlined),
        content: t('common.modal.modalContent'),
        okText: t('common.tobarText.yes'),
        cancelText: t('common.tobarText.no'),
        onOk: async () => {
            await store.dispatch('user/dispatchLogOut', true)
        }
    })
}
const setMenuList = arr => {
    try {
        return arr.map(v => {
            return {
                ...v,
                routerUrl: v.permissionCode,
                treeNodeList:
                    v.treeNodeList && v.treeNodeList.length
                        ? setMenuList(v.treeNodeList)
                        : v.treeNodeList
            }
        })
    } catch (error) {
        return []
    }
}
</script>
<style scoped>
.odpm-suspension {
    width: 12px;
    height: 35px;
    border-radius: 20%;
    background: #fff;
    box-shadow: 0px 6px 12px 0px rgba(0, 0, 0, 0.2);
    position: absolute;
    z-index: 999;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    justify-content: center;
}
.odpm-suspension-normal {
    position: absolute;
    top: 50%;
    margin: 0px 0 0 256px;
}
.odpm-suspension-min {
    position: absolute;
    top: 50%;
    margin: 0px 0 0 108px;
}

.fade-slide-leave-active,
.fade-slide-enter-active {
    transition: all 0.3s;
}

.fade-slide-enter-from {
    opacity: 0;
    transform: translateX(-30px);
}

.fade-slide-leave-to {
    opacity: 0;
    transform: translateX(30px);
}
.copyright {
    margin-top: 20px;
    height: 48px;
    line-height: 48px;
    text-align: center;
    background-color: #fff;
    border-radius: 8px;
}
</style>
