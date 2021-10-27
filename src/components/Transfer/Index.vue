<template>
  <div class="transfer-wrapper">
    <TransferColumn
      ref="transferColumnLeftEl"
      :title="titles[0]"
      :id-field="idField"
      :label-field="labelField"
      :data="leftData"
      :disabled="leftDisabled"
      :checked="leftChecked"
    >
      <template #head>
        <slot name="left-head"></slot>
      </template>
      <template #footer="{ currentChecked }">
        <slot name="left-footer" :current-checked="currentChecked"></slot>
      </template>
    </TransferColumn>
    <div class="actions">
      <template v-if="direction !== 'none'">
        <el-button
          v-if="direction !== 'right'"
          type="primary"
          @click="handleTransferToLeft"
        >
          &lt; {{ texts[0] }}
        </el-button>
        <el-button
          v-if="direction !== 'left'"
          type="primary"
          @click="handleTransferToRight"
        >
          {{ texts[1] }} &gt;
        </el-button>
      </template>
    </div>
    <TransferColumn
      ref="transferColumnRightEl"
      :title="titles[1]"
      :id-field="idField"
      :label-field="labelField"
      :data="rightData"
      :disabled="rightDisabled"
      :right-checked="rightChecked"
    >
      <template #head>
        <slot name="right-head"></slot>
      </template>
      <template #footer="{ currentChecked }">
        <slot name="right-footer" :current-checked="currentChecked"></slot>
      </template>
    </TransferColumn>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue'
import TransferColumn, { CTransferDataField, CTransferData } from './TransferColumn.vue'
export default defineComponent({
  components: {
    TransferColumn
  },
  props: {
    idField: {
      type: String as PropType<CTransferDataField>,
      default: 'id'
    },
    labelField: {
      type: String as PropType<CTransferDataField>,
      default: 'label'
    },
    direction: {
      type: String as PropType<'right' | 'left' | 'both' | 'none'>,
      default: 'both'
    },
    titles: {
      type: Array as PropType<Array<string>>,
      default: ()=> {
        return []
      }
    },
    texts: {
      type: Array as PropType<Array<string>>,
      default : ()=> {
        return []
      }
    },
    leftData: {
      type: Array as PropType<Array<CTransferData>>,
      default: () => {
        return []
      }
    },
    leftDisabled: {

      type: Array as PropType<Array<string | number>>,
      default: () => {
        return []
      }
    },
    leftChecked: {
      type: Array as PropType<Array<string | number>>,
      default: () => {
        return []
      }
    },
    rightData: {
      type: Array as PropType<Array<CTransferData>>,
      default: () => {
        return []
      }
    },
    rightDisabled: {
      type: Array as PropType<Array<string | number>>,
      default: () => {
        return []
      }
    },
    rightChecked: {

      type: Array as PropType<Array<string | number>>,
      default: () => {
        return []
      }
    }
  },
  emits: ['to-left', 'to-right'],
  setup (props, { emit }) {

    const transferColumnLeftEl = ref<InstanceType<typeof TransferColumn>>()
    const transferColumnRightEl = ref<InstanceType<typeof TransferColumn>>()

    function handleTransferToRight () {
      emit('to-right', transferColumnLeftEl?.value?.currentChecked.slice())
    }
    function handleTransferToLeft () {
      emit('to-left', transferColumnLeftEl?.value?.currentChecked.slice())
    }
    return {
      transferColumnLeftEl,
      transferColumnRightEl,
      handleTransferToRight,
      handleTransferToLeft
    }
  }

})
</script>
<style lang="stylus" scoped>
.actions
  display inline-block
  text-align center
  padding 10px
</style>
