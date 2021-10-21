<template>
  <div class="cell-content">
    <div class="cell-main-content" style="width: 90%">
      <el-input
        v-if="!readonly"
        ref="input"
        v-model="value"
        class="edit-input"
        @focus="handleFocus"
        @blur="handleBlur"
      ></el-input>
      <div v-else class="input-place">{{ initValue }}</div>
    </div>
    <i class="el-icon-edit icon" style="cursor: pointer;" @click="handleEdit"></i>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, PropType, watch } from 'vue'
type EditCellValue = string | number | boolean | undefined
export default defineComponent({
  name: 'CCellEdit',
  components: {},
  props: {
    initValue: {
      type: String as PropType<EditCellValue>,
      default: ''
    }
  },
  emits: ['input', 'blur'],
  setup (props, { emit }) {
    const value = ref<EditCellValue>('')
    const readonly = ref(true)

    watch(() => props.initValue, val => {
      value.value = val
    },{ immediate:true })

    function handleInput (val: EditCellValue) {
      value.value = val
      emit('input', val)
    }
    function handleEdit () {
      readonly.value = false
    }
    function handleBlur () {
      readonly.value = true
      emit('blur', value.value)
    }
    function handleFocus (e: FocusEvent) {
      (e.target as HTMLInputElement).select()
    }

    return {
      value,
      readonly,
      handleInput,
      handleEdit,
      handleBlur,
      handleFocus
    }
  }
})
</script>

<style lang="stylus" scoped>
.cell-content
  display flex
  flex-direction row
  align-items center
  justify-content space-between
  color #606266
.icon
  visibility hidden
.cell-content:hover .icon
  visibility visible
.input-place
  white-space nowrap
  overflow hidden
  text-overflow ellipsis
</style>
