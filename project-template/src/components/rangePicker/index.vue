<template>
    <a-range-picker
        :value="modelRef.dateRange"
        :value-format="valueFormat"
        :show-time="showTime"
        :ranges="computedRanges"
        @change="handleChange"
        @panelChange="val => handleChange(val, 'panelChange')"
        :allow-clear="false"
        :disabled-date="disabledDate"
        v-bind="$attrs"
    />
</template>

<script setup>
import { computed, reactive, watch } from 'vue'
import dayjs from 'dayjs'
import { useI18n } from 'vue-i18n'
import { handleRangePickerChange, computedPresetTimeRanges } from '@/utils/common'

/** props */
const props = defineProps({
    // 是否显示时间
    showTime: {
        type: Boolean,
        default: true
    },
    // 格式化日期格式
    valueFormat: {
        type: String,
        default: 'YYYY-MM-DD HH:mm:ss'
    },
    // 开始时间日期格式
    startTimeFormat: {
        type: String,
        default: ''
    },
    // 结束时间日期格式
    endTimeFormat: {
        type: String,
        default: ''
    },
    // 结束时间
    endTime: {
        type: String,
        default: ''
    },
    // 预设时间
    ranges: {
        type: [Object, Boolean],
        default: () => ({})
    },
    // 时间范围
    range: {
        type: Array,
        default: () => []
    },
    // 不可选择的日期
    disabledDate: Function
})
const emits = defineEmits(['update:range'])
/** state */
const { t } = useI18n()

/** computed */
// 计算开始时间日期格式
const computedStartTimeFormat = computed(() => {
    let { startTimeFormat, valueFormat } = props
    return (
        startTimeFormat ||
        (valueFormat === 'YYYY-MM-DD HH:mm:ss' ? 'YYYY-MM-DD 00:00:00' : 'YYYY-MM-DD')
    )
})
// 计算结束时间日期格式
const computedEndTimeFormat = computed(() => {
    let { endTimeFormat, valueFormat } = props
    return (
        endTimeFormat ||
        (valueFormat === 'YYYY-MM-DD HH:mm:ss' ? 'YYYY-MM-DD 23:59:59' : 'YYYY-MM-DD')
    )
})

// 计算结束时间（默认是今天）
const computedEndTime = computed(() => {
    let { endTime } = props
    return endTime || dayjs().format(computedEndTimeFormat.value)
})

// 预设时间范围
const timeRange = computedPresetTimeRanges.value(
    computedStartTimeFormat.value,
    computedEndTimeFormat.value,
    computedEndTime.value
)

const modelRef = reactive({
    dateRange: [...props.range]
})

/** computed */
// 计算预设时间
const computedRanges = computed(() => {
    if (props.ranges === false) {
        return []
    }
    let rangesConfig = {
        [t('common.today')]: timeRange[0],
        [t('common.last7Days')]: timeRange[7],
        [t('common.thisMonth')]: timeRange[30],
        [t('common.thisYear')]: timeRange[365],
        ...props.ranges
    }
    for (const key in rangesConfig) {
        const ranges = rangesConfig[key]
        rangesConfig[key] = getRange(ranges)
    }
    return rangesConfig
})

/** watch */
watch(
    () => props.range,
    val => {
        modelRef.dateRange = val
    },
    {
        deep: true
    }
)

/** methods */
// 获取时间范围
function getRange(ranges) {
    return Object.values(ranges).reduce((prev, current) => {
        prev.push(dayjs(current))
        return prev
    }, [])
}

// 日期范围发生变化/日期面板变化时的回调
const handleChange = (value, type) => {
    if (!(type === 'panelChange' && props.disabledDate)) {
        handleRangePickerChange(value, modelRef, 'dateRange', () => {
            emits('update:range', modelRef.dateRange)
        })
    }
}

// 暴露数据供外部通过ref使用
defineExpose({
    modelRef,
    computedRanges,
    handleChange
})
</script>

<style scoped lang="less"></style>
