import { ref } from 'vue'

export const formatBreadList = (router) => {
    const val = ref([])
    if (
        router &&
        router.currentRoute &&
        router.currentRoute.value &&
        router.currentRoute.value.matched &&
        router.currentRoute.value.matched.length
    ) {
        router.currentRoute.value.matched.forEach((item) => {
            if (item.name !== 'Layout') {
                val.value.push(item.meta.title)
            }
        })
    }
    return {
        val
    }
}
