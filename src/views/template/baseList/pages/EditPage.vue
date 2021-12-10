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
import { defineComponent, ref, toRefs, reactive, PropType, inject } from 'vue'
import { useStore } from '@/store'
import { evil as functionEvil, disposalField } from '@/utlis/common'
import apiFetch from '@/services/fetch'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
// import { MenuDetail, MenuFields } from '@/services/menu'
import { MenuDetail, MenuApi, MenuFields } from '@/services/menu'
import  { BaseListRow, baseIndexKey, InjectionKeyType } from '@/hooks/baseList/usePageDataInit'
import { ElForm, ElNotification } from 'element-plus'

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
  // emits: ['go-back', 'upsert-end'],
  emits: {
    'go-back': () => true,
    'upsert-end': () => true
  },
  setup (props, { emit }) {
    const $store = useStore()
    const { t: _$t } = useI18n()
    const baseIndex = inject<InjectionKeyType>(baseIndexKey) as InjectionKeyType
    const ruleFormEl = ref<InstanceType<typeof ElForm>>()

    // const mode = props.mode
    // const menu = props.menu
    // const id = props.id
    const { mode, id } = toRefs(props)

    // interface OrderItem {
    //   required: boolean
    //   message: number
    //   trigger: string | Array<string>
    // }
    let aaa = ref('')
    interface dataType {
      roleIdsOption: Array<any>
      defaultProps: {
        children: string
        label: string
      }
      dialogVisible: boolean
      isReadonly: boolean
      fields: Array<MenuFields<BaseListRow>>
      api: MenuApi
      form: {[key: string]: any;}
      rules: ELFormRulesMap
      // rules: {
      //   [key: string]: Array<OrderItem>
      // }
    }
    const _this:dataType = reactive({
      roleIdsOption: [],
      defaultProps: {
        children: 'child',
        label: 'name'
      },
      dialogVisible: false,
      isReadonly: false,
      fields: [],
      api: {
        add: ['', ''],
        delete: ['', ''],
        detail: ['', ''],
        list: ['', ''],
        update: ['', ''],
        department:['', '']
      },
      form: {},
      rules: {
        noEmpty: [
          { required: true, message: _$t('message.noEmpty'), trigger: ['blur', 'change'] }
        ]
      }
    })

    function setItemRule (required = false) {
      const rule = required ? _this.rules.noEmpty : []
      return rule
    }

    function parseFormField (menu: MenuDetail) {
      const fields = functionEvil<Array<MenuFields<BaseListRow>>>(menu.fields)
      _this.api = functionEvil(menu.api)
      console.log('api===', _this.api)
      _this.fields = disposalField(fields, 3)
      _this.fields.forEach(item => {
        _this.form[item.prop] = ''
      })
      if (id.value) {
        fetchData()
      }
    }

    function fetchData () {
      const params = {}
      params[baseIndex.primaryKey.value] = id.value
      apiFetch({
        method: 'get',
        url: _this.api.detail[0],
        params
      }).then(data => {
        _this.form = data
      })
    }

    function saveForm () {
      ruleFormEl.value.$refs.form.validate(valid => {
        if (valid) {
          const form = JSON.parse(JSON.stringify(_this.form))
          if (form.id) {
            apiFetch({
              method: _this.api.update[1],
              url: _this.api.update[0],
              data: form
            })
              .then(() => {
                ElMessage.success(_$t('message.editSuccess'))
                emit('upsert-end')
              })
              .catch(res => {
                if (res.message) {
                  ElMessage.error(res.message)
                }
              })
          } else {
            apiFetch({
              method: _this.api.add[1],
              url: _this.api.add[0],
              data: form
            }).then(() => {
              ElMessage.success(_$t('message.newSuccess'))
              emit('upsert-end')
            })
              .catch(res => {
                if (res.message) {
                  ElMessage.error(res.message)
                }
              })
          }
        }
      })
    }

    mode.value === 'read' ? _this.isReadonly = true : _this.isReadonly = false
    parseFormField(props.menu)

    return {
      ...toRefs(_this),
      saveForm,
      setItemRule,
      aaa,
      $store,
      ruleFormEl
    }
  }

})
</script>
