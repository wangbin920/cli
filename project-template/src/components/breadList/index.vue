<template>
    <div class="bread-list" v-if="isBreadList">
        <Breadcrumb :breadList="breadList"> </Breadcrumb>
        <!-- <a-breadcrumb class="lav_bread">
            <a-breadcrumb-item v-for="item in breadList" :key="item">{{
                t(item)
            }}</a-breadcrumb-item>
        </a-breadcrumb> -->
    </div>
</template>

<script setup>
import { watchEffect, ref, nextTick } from 'vue'
import { Breadcrumb } from 'op-template'
import { useRouter, useRoute } from 'vue-router'
import { formatBreadList } from '@/utils/composable'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const route = useRoute()
const { t } = useI18n()
const breadList = ref(formatBreadList(router).val.value)
const isBreadList = ref(false)
watchEffect(() => {
    if (
        router &&
        router.currentRoute &&
        router.currentRoute.value &&
        router.currentRoute.value.path
    ) {
        isBreadList.value =
            router.currentRoute.value.meta.accountTopbarShow === false ? false : true
        nextTick(() => {
            breadList.value = formatBreadList(router).val.value.map(item => t(item))
        })
    }
})
</script>

<style lang="less" scoped>
.lav_bread {
    margin: 0 0 16px;
}
</style>
