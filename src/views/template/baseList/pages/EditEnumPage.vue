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
            :options="item.options"
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
          <el-form-item
            v-if="item.prop === 'options'"
            label="枚举值"
          >
            <el-row>
              <el-col style="padding-bottom:10px">
                <el-button @click="hancleAddOption">{{ $t('addValue') }}</el-button>
              </el-col>
            </el-row>
            <div class="enum-value">
              <el-row v-for="(option, index) in optionForm" :key="index" :gutter="14">
                <el-col :span="9">
                  <el-form-item label="label" label-width="62px">
                    <el-input v-model="option.label" autocomplete="off"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="9">
                  <el-form-item label="value" label-width="62px">
                    <el-input v-model="option.value" autocomplete="off"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="3">
                  <!-- http://gitlab.skysri.com/flower/violet-engine/issues/39 -->
                  <el-form-item label="color" label-width="62px">
                    <el-color-picker v-model="option.color" color-format="rgb"></el-color-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="3">
                  <el-button type="text" icon="el-icon-delete" @click="handleDeleteOption(index)"></el-button>
                </el-col>
              </el-row>
            </div>
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

// import { defineComponent, ref, toRefs, reactive, PropType, inject } from 'vue'
// import { useStore } from '@/store'
// import { evil as functionEvil, disposalField } from '@/utlis/common'
// import apiFetch from '@/services/fetch'
// import { useI18n } from 'vue-i18n'
// import { ElMessage } from 'element-plus'
// // import { MenuDetail, MenuFields } from '@/services/menu'
// import { MenuDetail, MenuApi, MenuFields } from '@/services/menu'
// import  { BaseListRow, baseIndexKey, InjectionKeyType } from '@/hooks/baseList/usePageDataInit'
// import { ElForm } from 'element-plus'

export default defineComponent({
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
    const {
      _this,
      saveForm,
      setItemRule,
      parseFormField } = useEditBaeList<Ref<InstanceType<typeof ElForm>>, InjectionKeyType, Ref<string>>({ ruleFormEl, baseIndex, id, upsertEnd, fetchDataCallback })

    mode.value === 'read' ? _this.isReadonly = true : _this.isReadonly = false
    interface optionFormType{
      label: string
      value: string
    }
    let optionForm = ref<Array<optionFormType>>([])
    function hancleAddOption () {
      optionForm.value.push({
        label: '',
        value: ''
      })
    }
    function handleDeleteOption (key: number) {
      optionForm.value.splice(key, 1)
    }
    function upsertEnd() {
      emit('upsert-end')
    }
    function fetchDataCallback(data) {
      console.log('data==', data)
      optionForm.value = eval('(' + data.options + ')')
    }
    // 获取详情
    parseFormField(props.menu)

    return {
      ...toRefs(_this),
      $store,
      ruleFormEl,
      saveForm,
      setItemRule,
      optionForm,
      hancleAddOption,
      handleDeleteOption
    }
  }
})
</script>
<style lang="stylus" scoped>
.enum-value
  padding-top 15px
  background #f2f2f2
</style>
