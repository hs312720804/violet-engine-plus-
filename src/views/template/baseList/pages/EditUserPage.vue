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
        <!-- {{ form }} -->
        <div v-for="(item, key) in fields" :key="key">
          <template v-if="form.id && item.prop !== 'password'">
            <c-form-string
              v-if="item.inputType === 'string'"
              :key="key"
              v-model="form[item.prop]"
              :label="item.label"
              :placeholder="$t('pleaseEnter', [item.label])"
              :rules="setItemRule(item)"
              :prop="item.prop"
              class="el-item-width"
            ></c-form-string>
          </template>
          <template v-if="!form.id">
            <c-form-string
              v-if="item.inputType === 'string'"
              :key="key"
              v-model="form[item.prop]"
              :label="item.label"
              :placeholder="item.prop === 'password' ? '密码8-16位且不可输入汉字' : $t('pleaseEnter', [item.label])"
              :rules="setItemRule(item)"
              :prop="item.prop"
              class="el-item-width"
            ></c-form-string>
          </template>
          <el-form-item v-if="form.id && item.prop === 'password' " label="密码">
            <el-button @click="handleChangePassword">修改密码</el-button>
          </el-form-item>
          <c-form-enum
            v-if="item.inputType === 'enum'"
            :key="key"
            v-model="form[item.prop]"
            :label="item.label"
            type="radio"
            :prop="item.prop"
            :rules="setItemRule(item)"
            :options="$store.getters.getEnumOptions(item.options)"
          ></c-form-enum>
          <el-form-item
            v-if="item.inputType === 'date'"
            :label="item.label"
            :rules="setItemRule(item)"
          >
            <el-date-picker
              v-model="form[item.prop]"
              type="date"
              :placeholder="$t('pleaseSelect', [$t('date.date')])"
            >
            </el-date-picker>
          </el-form-item>
          <c-form-any v-if="item.prop === 'departmentId'" :prop="item.prop" :label="$t('department')">
            <template #edit>
              <el-cascader
                v-model="form[item.prop]"
                style="width: 400px"
                :options="organizationOptions"
                :props="{
                  checkStrictly: true,
                  label: 'name',
                  value: 'id',
                  expandTrigger: 'hover'
                }"
                placeholder="请选择部门"
              >
              </el-cascader>
            </template>
          </c-form-any>
        </div>
      </div>
      <el-form-item v-if="!isReadonly">
        <el-button type="success" @click="$emit('go-back')">{{ $t('btn.cancel') }}</el-button>
        <el-button type="primary" @click="saveForm()">{{ $t('btn.save') }}</el-button>
      </el-form-item>
    </c-form>
    <ChangePassword
      v-if="passwordVisible"
      :row="form"
      :visible="passwordVisible"
      @close="dialogClose"
    ></ChangePassword>
  </div>
</template>
<script lang="ts">
import ChangePassword from '@/components/UserChangePassword.vue'

import { defineComponent, ref, Ref, toRefs, PropType, inject } from 'vue'
import { useStore } from '@/store'
import { useI18n } from 'vue-i18n'
import { MenuDetail } from '@/services/menu'
import  { baseIndexKey, InjectionKeyType } from '@/hooks/baseList/usePageDataInit'
import { ElForm } from 'element-plus'
import useEditBaeList from '@/hooks/useEditBaeList'
import apiFetch from '@/services/fetch'
import { ElMessage } from 'element-plus'

export default defineComponent({
  components: {
    ChangePassword
  },
  // inject: ['baseIndex'],
  // props: ['mode', 'id', 'menuId', 'menu'],
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
  setup (props, { emit }) {
    const $store = useStore()
    const { t: _$t } = useI18n()
    // const baseIndex = inject<InjectionKeyType>(baseIndexKey) as InjectionKeyType
    const ruleFormEl = ref<InstanceType<typeof ElForm>>()
    debugger
    const { mode, id } = toRefs(props)

    const {
      _this,
      parseFormField } = useEditBaeList<Ref<InstanceType<typeof ElForm>>, InjectionKeyType, Ref<string>>({ ruleFormEl, primaryKeyValue: 'userId', id, upsertEnd })

    // 初始化数据
    mode.value === 'read' ? _this.isReadonly = true : _this.isReadonly = false
    let passwordVisible = ref(false)
    let organizationOptions = ref([])
    _this.form.departmentId = 1
    _this.form.status = 'ENABLE'
    _this.form.rules = {
      phone: [
        { validator: checkPhone }
      ],
      password: [
        { validator: checkPassword }
      ],
      email: [
        { type: 'email', message: _$t('message.emailIncorrect'), trigger: 'blur' }
      ]
    }

    // created 获取详情
    parseFormField(props.menu)
    getDepartment()

    // 函数
    function upsertEnd() {
      emit('upsert-end')
    }

    function handleChangePassword () {
      passwordVisible.value = true
    }

    function dialogClose () {
      passwordVisible.value = false
    }

    function checkPhone (rule, value, callback) {
      if (!this.$cUtils.validate.isMobile(value)) {
        callback(new Error('请输入正确的手机号码'))
      } else {
        callback()
      }
    }

    function checkPassword (rule, value, callback) {
      if (!_this.form.id) {
        if (!/^[^\u4e00-\u9fa5]{0,}$/.test(value)) {
          callback(new Error('请输入非中文字符'))
        } else if (value.length < 8 || value.length > 16) {
          callback(new Error('密码长度8-16位'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }

    function setItemRule (item) {
      const noEmpty = [{
        required: true,
        message: _$t('pleaseEnter', [item.label])
      }]
      if (item.prop in _this.rules) {
        let itemRule = JSON.parse(JSON.stringify(noEmpty))
        _this.rules[item.prop].forEach(obj => {
          itemRule.push(obj)
        })
        return itemRule
      } else {
        const rule = item.required ? noEmpty : []
        return rule
      }
    }

    function getDepartment () {
      // this.$service.fetch({
      //   method: this.api.department[1],
      //   url: this.api.department[0]
      // }).then(data => {
      //   this.organizationOptions = data
      // })

      apiFetch({
        method: _this.api.department[1],
        url: _this.api.department[0],
        data: _this.form
      }).then(data => {
        organizationOptions.value = data
      })
    }

    function saveForm () {
      // 保存前表单验证
      ruleFormEl.value.$refs.form.validate(valid => {
        if (valid) {
          const form = JSON.parse(JSON.stringify(_this.form))
          if (form.departmentId instanceof Array) {
            form.departmentId = _this.form.departmentId[_this.form.departmentId.length - 1]
          }
          delete form.updatedTime
          delete form.createdTime
          // 编辑
          if (form.id) {
            apiFetch({
              method: _this.api.update[1],
              url: _this.api.update[0],
              data: form,
              isJSON: false
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
              data: form,
              isJSON: false
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

    // 获取详情
    // function fetchData () {
    //   const params = {}
    //   debugger
    //   params[baseIndex.primaryKey.value] = id.value
    //   apiFetch({
    //     method: 'get',
    //     url: _this.api.detail[0],
    //     params
    //   }).then(data => {
    //     _this.form = data // 表单
    //     fetchDataCallback && fetchDataCallback(data)
    //   })
    // }

    // function fetchDataFn () {
    //   apiFetch({
    //     method: _this.api.detail[1],
    //     url: _this.api.detail[0],
    //     params: {
    //       userId: id.value
    //     }
    //   }).then(data => {
    //     debugger
    //     _this.form = data
    //   })
    // }

    return {
      ...toRefs(_this),
      $store,
      ruleFormEl,
      saveForm,
      setItemRule,
      passwordVisible,
      organizationOptions,
      handleChangePassword,
      dialogClose,
      getDepartment,
      checkPassword

    }
  }
  // data () {
  //   return {
  //     roleIdsOption: [],
  //     defaultProps: {
  //       children: 'child',
  //       label: 'name'
  //     },
  //     dialogVisible: false,
  //     isReadonly: false,
  //     fields: [],
  //     organizationOptions: [],
  //     api: {},
  //     form: {
  //       departmentId: 1,
  //       status: 'ENABLE'
  //     },
  //     passwordVisible: false,
  //     rules: {
  //       phone: [
  //         { validator: this.checkPhone }
  //       ],
  //       password: [
  //         { validator: this.checkPassword }
  //       ],
  //       email: [
  //         { type: 'email', message: this.$t('message.emailIncorrect'), trigger: 'blur' }
  //       ]
  //     }
  //   }
  // },
  // created () {
  //   this.mode === 'read' ? this.isReadonly = true : this.isReadonly = false
  //   this.parseFormField(this.menu)
  //   this.getDepartment()
  // },
  // methods: {
  //   handleChangePassword () {
  //     this.passwordVisible = true
  //   },
  //   dialogClose () {
  //     this.passwordVisible = false
  //   },
  //   checkPhone (rule, value, callback) {
  //     if (!this.$cUtils.validate.isMobile(value)) {
  //       callback(new Error('请输入正确的手机号码'))
  //     } else {
  //       callback()
  //     }
  //   },
  //   checkPassword (rule, value, callback) {
  //     if (!this.form.id) {
  //       if (!/^[^\u4e00-\u9fa5]{0,}$/.test(value)) {
  //         callback(new Error('请输入非中文字符'))
  //       } else if (value.length < 8 || value.length > 16) {
  //         callback(new Error('密码长度8-16位'))
  //       } else {
  //         callback()
  //       }
  //     } else {
  //       callback()
  //     }
  //   },
  //   setItemRule (item) {
  //     const noEmpty = [{
  //       required: true,
  //       message: this.$t('pleaseEnter', [item.label])
  //     }]
  //     if (item.prop in this.rules) {
  //       let itemRule = JSON.parse(JSON.stringify(noEmpty))
  //       this.rules[item.prop].forEach(obj => {
  //         itemRule.push(obj)
  //       })
  //       return itemRule
  //     } else {
  //       const rule = item.required ? noEmpty : []
  //       return rule
  //     }
  //   },
  //   parseFormField (menu) {
  //     const fields = this.$constants.evil(menu.fields)
  //     this.api = this.$constants.evil(menu.api)
  //     this.fields = this.baseIndex.disposalField(fields, 3)
  //     if (this.id) {
  //       this.fetchData()
  //     }
  //   },
  //   getDepartment () {
  //     this.$service.fetch({
  //       method: this.api.department[1],
  //       url: this.api.department[0]
  //     }).then(data => {
  //       this.organizationOptions = data
  //     })
  //   },
  //   fetchData () {
  //     const params = {}
  //     this.$service.fetch({
  //       method: this.api.detail[1],
  //       url: this.api.detail[0],
  //       params: {
  //         userId: this.id
  //       }
  //     }).then(data => {
  //       this.form = data
  //     })
  //   },

  // }
})
</script>
