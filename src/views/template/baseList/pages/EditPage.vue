<template>
  <div>
    <c-form
      ref="ruleFormEl"
      label-width="100px"
      :model="form"
      :rules="rules"
      :readonly="isReadonly"
    >
      <div v-if="fields.length > 0">
        <div v-for="(item, key) in fields" :key="key">
          <c-form-string
            v-if="item.inputType === 'string' || !item.inputType"
            :key="key"
            v-model="form[item.prop]"
            :label="item.label"
            :placeholder="$t('pleaseEnter', [item.label])"
            :rules="setItemRule(item.required)"
            :prop="item.prop"
            class="el-item-width"
          ></c-form-string>
          <c-form-enum
            v-if="item.inputType === 'enum'"
            :key="key"
            v-model="form[item.prop]"
            :label="item.label"
            type="radio"
            :prop="item.prop"
            :rules="setItemRule(item.required)"
            :options="$store.getters.getEnumOptions(item.options)"
          ></c-form-enum>
          <el-form-item
            v-if="item.inputType === 'date'"
            :label="item.label"
            :rules="setItemRule(item.required)"
          >
            <el-date-picker
              v-model="form[item.prop]"
              type="date"
              :placeholder="$t('pleaseSelect', [$t('date.date')])"
            >
            </el-date-picker>
          </el-form-item>
        </div>
      </div>
      <el-form-item v-if="!isReadonly">
        <el-button type="success" @click="$emit('go-back')">{{ $t('btn.cancel') }}</el-button>
        <el-button v-debounce="[saveForm, 'click', 500]" type="primary">{{ $t('btn.save') }}</el-button>
      </el-form-item>
    </c-form>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, Ref, toRefs, PropType, inject } from 'vue'
import { useStore } from '@/store'
import { useI18n } from 'vue-i18n'
import { MenuDetail } from '@/services/menu'
import  { baseIndexKey, InjectionKeyType } from '@/hooks/baseList/usePageDataInit'
import { ElForm } from 'element-plus'
import useEditBaeList from '@/hooks/useEditBaeList'

export default defineComponent({
  // inject: ['baseIndex'],
  props: {
    mode: {
      type: String,
      default: ''
    },
    id: {
      type: String,
      default: ''
    },
    menuId: {
      type: String,
      default: ''
    },
    menu: {
      type: Object as PropType<MenuDetail>,
      default: () => {
        return {}
      }
    }
  },
  emits: {
    'go-back': () => true,
    'upsert-end': () => true
  },
  setup (props, { emit }) {
    const $store = useStore()
    const { t: _$t } = useI18n()
    const baseIndex = inject<InjectionKeyType>(baseIndexKey) as InjectionKeyType
    const ruleFormEl = ref<InstanceType<typeof ElForm>>()
    const { mode, id } = toRefs(props)


    function upsertEnd() {
      emit('upsert-end')
    }
    const {
      _this,
      saveForm,
      setItemRule,
      parseFormField } = useEditBaeList<Ref<InstanceType<typeof ElForm>>, InjectionKeyType, Ref<string>>(ruleFormEl, baseIndex, id, upsertEnd)

    mode.value === 'read' ? _this.isReadonly = true : _this.isReadonly = false

    // 获取详情
    parseFormField(props.menu)

    return {
      ...toRefs(_this),
      $store,
      ruleFormEl,
      saveForm,
      setItemRule
    }
  }

})
</script>
