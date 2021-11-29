<template>
  <div>
    <c-form
      ref="form"
      label-width="100px"
      :model="form"
      :rules="rules"
      :readonly="isReadonly"
    >
      <div v-if="fields.length > 0">
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
            <div slot="edit">
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
              >
              </el-cascader>
            </div>
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
<script>
import ChangePassword from '@/components/UserChangePassword.vue'
export default {
  components: {
    ChangePassword
  },
  inject: ['baseIndex'],
  props: ['mode', 'id', 'menuId', 'menu'],
  data () {
    return {
      roleIdsOption: [],
      defaultProps: {
        children: 'child',
        label: 'name'
      },
      dialogVisible: false,
      isReadonly: false,
      fields: [],
      organizationOptions: [],
      api: {},
      form: {
        departmentId: 1,
        status: 'ENABLE'
      },
      passwordVisible: false,
      rules: {
        phone: [
          { validator: this.checkPhone }
        ],
        password: [
          { validator: this.checkPassword }
        ],
        email: [
          { type: 'email', message: this.$t('message.emailIncorrect'), trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.mode === 'read' ? this.isReadonly = true : this.isReadonly = false
    this.parseFormField(this.menu)
    this.getDepartment()
  },
  methods: {
    handleChangePassword () {
      this.passwordVisible = true
    },
    dialogClose () {
      this.passwordVisible = false
    },
    checkPhone (rule, value, callback) {
      if (!this.$cUtils.validate.isMobile(value)) {
        callback(new Error('请输入正确的手机号码'))
      } else {
        callback()
      }
    },
    checkPassword (rule, value, callback) {
      if (!this.form.id) {
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
    },
    setItemRule (item) {
      const noEmpty = [{
        required: true,
        message: this.$t('pleaseEnter', [item.label])
      }]
      if (item.prop in this.rules) {
        let itemRule = JSON.parse(JSON.stringify(noEmpty))
        this.rules[item.prop].forEach(obj => {
          itemRule.push(obj)
        })
        return itemRule
      } else {
        const rule = item.required ? noEmpty : []
        return rule
      }
    },
    parseFormField (menu) {
      const fields = this.$constants.evil(menu.fields)
      this.api = this.$constants.evil(menu.api)
      this.fields = this.baseIndex.disposalField(fields, 3)
      if (this.id) {
        this.fetchData()
      }
    },
    getDepartment () {
      this.$service.fetch({
        method: this.api.department[1],
        url: this.api.department[0]
      }).then(data => {
        this.organizationOptions = data
      })
    },
    fetchData () {
      const params = {}
      this.$service.fetch({
        method: this.api.detail[1],
        url: this.api.detail[0],
        params: {
          userId: this.id
        }
      }).then(data => {
        this.form = data
      })
    },
    saveForm () {
      this.$refs.form.$refs.form.validate(valid => {
        if (valid) {
          const form = JSON.parse(JSON.stringify(this.form))
          if (form.departmentId instanceof Array) {
            form.departmentId = this.form.departmentId[this.form.departmentId.length - 1]
          }
          delete form.updatedTime
          delete form.createdTime
          if (form.id) {
            this.$service.fetch({
              method: this.api.update[1],
              url: this.api.update[0],
              data: form,
              isJSON: false
            })
              .then(() => {
                this.$message.success(this.$t('message.editSuccess'))
                this.$emit('upsert-end')
              })
          } else {
            this.$service.fetch({
              method: this.api.add[1],
              url: this.api.add[0],
              data: form,
              isJSON: false
            }).then(() => {
              this.$message.success(this.$t('message.newSuccess'))
              this.$emit('upsert-end')
            })
          }
        }
      })
    }
  }
}
</script>
