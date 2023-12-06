import { computed } from 'vue'
import dayjs from 'dayjs'
import _ from 'lodash'
import { store } from '@/store'

// vuex--user
export const computedUserStore = computed(() => store.state.user)

/**
 *  计算默认日期
 * @returns 默认日期
 */
export function useDefaultDate () {
    const defaultDate = computed(() => {
        const todayDate = dayjs(new Date()).format('YYYY-MM-DD')
        const yesterdayDate = dayjs(new Date(todayDate).getTime() - 86400000).format('YYYY-MM-DD')
        return [yesterdayDate, yesterdayDate]
    })

    return {
        defaultDate
    }
}


