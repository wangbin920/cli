import { ref, useSlots } from "vue";

/**
 * 过滤出父组件正在使用的插槽
 * @param {*} slotList
 * @returns
 */
export function useFilterSlots (slotList) {
    const getSlotList = ref([])
    const slotsNames = Object.keys(useSlots())
    const slots = slotList.filter((item) => slotsNames.includes(item))
    slots.length && (getSlotList.value = slots)
    return {
        getSlotList
    }
}
