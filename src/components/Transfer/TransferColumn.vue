<template>
  <div class="transfer-wrapper">
    <div class="transfer">
      <div class="transfer-title">{{ title }}</div>
      <div class="transfer-head">
        <slot name="head"></slot>
      </div>
      <div class="transfer-body">
        <div v-for="item in data" :key="item[idField]" class="transfer-list">
          <el-checkbox
            v-if="!isHidden(item)"
            class="transfer-list__item"
            :disabled="isDisabled(item)"
            :value="isChecked(item)"
            @input="handleInput(item, $event)"
          >
            {{ item[labelField] }}
          </el-checkbox>
        </div>
      </div>
      <div class="transfer-footer">
        <slot name="footer" :current-checked="currentChecked"></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, computed, watch } from 'vue'
export type CTransferDataField = 'id' | 'label'
export type CTransferData = { [key in CTransferDataField]: any }
export interface IChecked {
  [key: string]: boolean
}
export default defineComponent({
  props: {
    title: {
      type: String,
      default: ''
    },
    idField: {
      type: String as PropType<CTransferDataField>,
      default: 'id'
    },
    labelField: {
      type: String as PropType<CTransferDataField>,
      default: 'label'
    },
    data: {
      type: Array as PropType<Array<CTransferData>>,
      default: () => {
        return []
      }
    },
    checked: {
      type: Array as PropType<Array<string | number>>,
      default: () => {
        return []
      }
    },
    disabled: {
      type: Array as PropType<Array<string | number>>,
      default: () => {
        return []
      }
    },
    hidden: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  setup (props) {
    const idField = computed(() => props.idField)
    const hidden = computed(() => props.hidden)
    const disabled = computed(() => props.disabled)

    // this.currentChecked = this.checked.slice()
    const currentChecked = ref(props.checked.slice())

    watch(() => props.data, updateCurrentChecked)

    function updateCurrentChecked () {
      const dataIndexed = props.data.reduce((result: IChecked, item) => {
        result[item[idField.value]] = true
        return result
      }, {})
      currentChecked.value = currentChecked.value.filter(item => dataIndexed[item])
    }
    function isDisabled (item: CTransferData) {
      return disabled.value.includes(item[idField.value])
    }
    function isChecked (item: CTransferData) {
      return currentChecked.value.includes(item[idField.value])
    }
    function isHidden (item: CTransferData) {
      return hidden.value.includes(item[idField.value])
    }
    function handleInput (item: CTransferData, val: boolean) {
      const id = item[idField.value]
      const cache = currentChecked
      if (val) {
        cache.value.push(id)
      } else {
        currentChecked.value = cache.value.filter(item => item !== id)
      }
    }
    return {
      currentChecked: [],
      isDisabled,
      isChecked,
      isHidden,
      handleInput
    }
  }

})
</script>
<style lang="stylus" scoped>
.transfer-wrapper
  border: 1px solid #ebeef5;
  border-radius: 4px;
  overflow: hidden;
  display: inline-block;
  background: #fff;
  vertical-align: middle;
  width: 200px;
  height: 350px
  max-height: 100%;
  box-sizing: border-box;
  position: relative;
.transfer
  display: flex;
  flex-direction column;
  height: 100%;
.transfer-title
  height: 40px;
  line-height: 40px;
  background: #f5f7fa;
  margin: 0;
  padding-left: 15px;
  border-bottom: 1px solid #ebeef5;
  box-sizing: border-box;
  color: #000;
.transfer-body
  flex 1
  overflow auto
.transfer-list
  margin: 0;
  padding: 6px 0;
  list-style: none;
  overflow: auto;
  box-sizing: border-box;
.transfer-list__item
  height: 30px;
  line-height: 30px;
  padding-left: 15px;
  display: block!important;
</style>
