<template>
    <a-sub-menu :key="item.id" popupClassName="odp-menu-submenu-popup">
        <template #expandIcon>
            <iconpark-icon
                :name="subMenuSelectIcon"
                class="sub-menu-select-icon"
                size="12"
            ></iconpark-icon>
        </template>

        <template v-slot:title>
            <span class="icon-wrap" v-if="item.moduleIconName">
                <iconpark-icon :name="item.moduleIconName" size="22"></iconpark-icon>
            </span>
            <span class="sub-menu">{{
                locale === 'zh-cn' ? item.moduleNameCn : item.moduleNameEn
            }}</span>
        </template>
        <slot></slot>
    </a-sub-menu>
</template>

<script setup>
import { defineProps, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()
const props = defineProps({
    item: {
        type: Object,
        default() {
            return {}
        }
    },

    routeChildren: {
        type: Object,
        default() {
            return null
        }
    }
})
const subMenuSelectIcon = ref('icon-a-Frame13213144032')
</script>
<style lang="less" scoped>
.icon-wrap {
    margin-right: 8px;
    display: flex;
    align-items: center;
}
</style>
