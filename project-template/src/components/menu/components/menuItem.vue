<template>
    <a-menu-item
        :key="routeChildren.id"
        @click.capture="handleLink"
        style="display: flex"
        class="menuItem"
    >
        <span class="icon-wrap" v-if="routeChildren.moduleIconName">
            <iconpark-icon :name="routeChildren.moduleIconName"></iconpark-icon>
        </span>
        <span class="menu-item">{{
            locale === 'zh-cn' ? item.moduleNameCn : item.moduleNameEn
        }}</span>
    </a-menu-item>
</template>

<script setup>
import { defineProps } from 'vue'
import { isExternal } from '@/utils'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const { t, locale } = useI18n()

const props = defineProps({
    item: {
        type: Object,
        default() {
            return null
        }
    },
    routeChildren: {
        type: Object,
        default: () => null
    }
})

const handleLink = () => {
    // moduleType '菜单类型 1-菜单 2-按钮 3-链接 4-系统',
    const { moduleType, moduleUrl } = props.routeChildren
    if (moduleType === 3) {
        if (isExternal(moduleUrl)) window.open(moduleUrl)
        else if (route.path !== moduleUrl) window.open(moduleUrl)
    } else {
        if (isExternal(moduleUrl)) window.location.href = moduleUrl
        else if (route.path !== moduleUrl)
            router.push(moduleUrl[0] === '/' ? moduleUrl : '/' + moduleUrl)
    }
}
</script>

<style lang="less" scoped>
.icon-wrap {
    margin-right: 8px;
}
</style>
