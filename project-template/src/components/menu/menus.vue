<template>
    <component
        :is="state.menuComponent"
        v-if="!item.hidden && item.moduleType !== 2"
        :item="item"
        :route-children="state.routeChildren"
    >
        <template v-if="item.treeNodeList && item.treeNodeList.length">
            <menus v-for="route in item.treeNodeList" :key="route.id" :item="route"></menus>
        </template>
    </component>
</template>

<script setup>
import { defineProps, reactive, markRaw } from 'vue'
import MenuItem from './components/menuItem'
import Submenu from './components/submenu'

const menuComponent = {
    MenuItem: markRaw(MenuItem),
    Submenu: markRaw(Submenu)
}

const props = defineProps({
    item: {
        type: Object,
        required: true
    }
})

const state = reactive({
    routeChildren: {},
    menuComponent: ''
})

const handleChildren = (children = []) => {
    if (!children) return []
    return children.filter(item => item.hidden !== true && item.moduleType !== 2)
}

const loadMenuComponent = () => {
    const { MenuItem, Submenu } = menuComponent
    const showChildren = handleChildren(props.item.treeNodeList)
    if (showChildren.length === 0) {
        state.menuComponent = MenuItem
        state.routeChildren = props.item
    } else {
        state.menuComponent = Submenu
    }
}

// 加载相应的菜单组件
loadMenuComponent()
</script>
<style lang="less">
.anticon {
    margin-right: 3px;
}
</style>
