import { reactive  } from 'vue'
import { evil as functionEvil, disposalField } from '@/utlis/common'
import apiFetch from '@/services/fetch'
import { ElMessage } from 'element-plus'
import { MenuDetail, MenuApi, MenuFields } from '@/services/menu'
import  { BaseListRow } from '@/hooks/baseList/usePageDataInit'
import { useI18n } from 'vue-i18n'

interface Params<T, B, I> {
  ruleFormEl: T
  primaryKeyValue: string
  id: I
  upsertEnd: () => void
  fetchDataCallback: () => void
}
export default function editBaseList<T, B, I> ({ ruleFormEl, primaryKeyValue, id, upsertEnd, fetchDataCallback, fetchDataFn }: Params<T, B, I>) {

  // interface OrderItem {
  //   required: boolean
  //   message: number
  //   trigger: string | Array<string>
  // }
  const { t: _$t } = useI18n()

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
  const _this = reactive<dataType>({
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

  // function setItemRule (item) {
  //   const noEmpty = [{
  //     required: true,
  //     message: this.$t('pleaseEnter', [item.label])
  //   }]
  //   if (item.prop in this.rules) {
  //     const itemRule = JSON.parse(JSON.stringify(noEmpty))
  //     this.rules[item.prop].forEach(obj => {
  //       itemRule.push(obj)
  //     })
  //     return itemRule
  //   } else {
  //     const rule = item.required ? noEmpty : []
  //     return rule
  //   }
  // }

  function parseFormField (menu: MenuDetail) {
    const fields = functionEvil<Array<MenuFields<BaseListRow>>>(menu.fields)
    _this.api = functionEvil(menu.api)
    console.log('api===', _this.api)
    _this.fields = disposalField(fields, 3)

    if (id && id.value) {
      fetchData()
    }
  }


  // 获取详情
  function fetchData () {
    if (fetchDataFn) return fetchDataFn()
    const params = {}
    // 关键字段：比如ID、userId
    params[primaryKeyValue] = id.value
    apiFetch({
      method: 'get',
      url: _this.api.detail[0],
      params
    }).then(data => {
      _this.form = data // 表单
      fetchDataCallback && fetchDataCallback(data)
    })
  }

  function saveForm () {
    // 保存前表单验证
    ruleFormEl.value.$refs.form.validate(valid => {
      if (valid) {
        const form = JSON.parse(JSON.stringify(_this.form))
        // 编辑
        if (form.id) {
          apiFetch({
            method: _this.api.update[1],
            url: _this.api.update[0],
            data: form
          })
            .then(() => {
              ElMessage.success(_$t('message.editSuccess'))
              upsertEnd()
              // emit('upsert-end')
            })
            .catch(res => {
              if (res.message) {
                ElMessage.error(res.message)
              }
            })
        } else { // 新增
          apiFetch({
            method: _this.api.add[1],
            url: _this.api.add[0],
            data: form
          }).then(() => {
            ElMessage.success(_$t('message.newSuccess'))
            upsertEnd()
            // emit('upsert-end')
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




  return {
    _this,
    saveForm,
    setItemRule,
    parseFormField,
    fetchData
  }
}

