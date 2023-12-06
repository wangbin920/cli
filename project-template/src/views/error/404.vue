<template>
    <div>
        <Result
            class="result"
            status="404"
            title="404"
            sub-title="Sorry, the page you visited does not exist."
        />
    </div>
</template>
<script>
import { defineComponent, ref } from 'vue'
import { Result } from 'ant-design-vue'
export default defineComponent({
    name: '',
    components: {
        Result
    },
    setup() {
        return {}
    }
})
</script>
<style scoped>
.result {
    margin-top: 100px;
}
</style>
