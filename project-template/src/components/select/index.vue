<template>
    <a-select
        showArrow
        :getPopupContainer="triggerNode => triggerNode.parentNode"
        v-bind="$attrs"
        :mode="mode"
        :style="style"
        :placeholder="placeholder"
        :max-tag-count="maxTagCount"
        :dropdown-class-name="computedDropdownClassName"
        :filter-option="handleFilterOption"
        :field-names="fieldNames"
        @change="handleChange"
    >
        <template v-if="mode === 'multiple'" #dropdownRender="{ menuNode: menu }">
            <div v-if="buttons" class="operation-buttons">
                <a-button type="primary" class="select-all" @click="handleSelect(true)">{{
                    t('common.select.selectAll')
                }}</a-button>
                <a-button @click="handleSelect(false)">{{ t('common.select.cancel') }}</a-button>
            </div>

            <v-nodes :vnodes="menu" />
        </template>

        <template v-for="(slotItem, index) in getSlotList" :key="index" #[slotItem]="slotsParams">
            <slot :name="slotItem" :slotsParams="slotsParams"></slot>
        </template>
        <a-select-option value="china" label="China"> &nbsp;&nbsp;China (中国) </a-select-option>
    </a-select>
</template>

<script>
import { defineComponent } from 'vue'
export default defineComponent({
    components: {
        VNodes: (_, { attrs }) => {
            return attrs.vnodes
        }
    }
})
</script>

<script setup>
import { computed, useAttrs } from 'vue'
import { useFilterSlots } from '../hooks/filterSlots.js'
import { useI18n } from 'vue-i18n'

/** props */
const { t } = useI18n()
const attrs = useAttrs()
const props = defineProps({
    mode: {
        type: String,
        default: 'multiple'
    },

    style: {
        type: Object,
        default: { minWidth: '200px', maxWidth: '500px' }
    },

    placeholder: {
        type: String,
        default: ''
    },
    // 最多显示多少个 tag
    maxTagCount: {
        type: Number,
        default: 1
    },
    // 自定义节点 label、value、options 的字段
    fieldNames: {
        type: Object,
        default: () => ({ label: 'label', value: 'value' })
    },

    onChange: {
        type: Function
    },
    // 是否需要按钮
    buttons: {
        type: Boolean,
        default: true
    }
})

/** state */
const slotList = [
    'default',
    'clearIcon',
    'dropdownRender',
    'maxTagPlaceholder',
    'menuItemSelectedIcon',
    'notFoundContent',
    'option',
    'placeholder',
    'removeIcon',
    'suffixIcon',
    'tagRender',
    'label'
]
const { getSlotList } = useFilterSlots(slotList)

/** computed */
const computedDropdownClassName = computed(() =>
    props.mode === 'multiple' ? 'ant-select-multiple-dropdown' : 'ant-select-dropdown'
)

// 计算所有options的值
const computedAllOptionValue = computed(() => {
    const { options } = attrs
    const { value } = props.fieldNames

    if (options) {
        return options.map(item => item[value])
    }
})

/** watch */

/** lifecycle */

/** methods */
const handleFilterOption = (inputValue, option) => {
    const { label } = props.fieldNames
    return option[label].toLowerCase().includes(inputValue.toLowerCase())
}

const emits = defineEmits(['update:value'])

const handleChange = (value, option) => {
    emits('update:value', value)
    let { onChange } = props
    onChange && onChange(value, option)
}

// 全选或取消全选
const handleSelect = selectType => {
    const { value } = attrs
    selectType ? value.push(...computedAllOptionValue.value) : value.splice(0, value.length)
    let uniqueValue = [...new Set(value)]
    emits('update:value', uniqueValue)
    let { onChange } = props
    onChange && onChange(uniqueValue)
}
</script>

<style scoped lang="less">
.ant-select {
    :deep(.ant-select-selector) {
        height: 32px;
    }
}

.ant-select-multiple-dropdown {
    .operation-buttons {
        padding: 2px 12px 8px;
        display: flex;
        justify-content: center;

        .ant-btn {
            width: 50%;
            height: 30px;
            line-height: normal;
        }

        .select-all {
            margin-right: 15px;
        }
    }
}
</style>
