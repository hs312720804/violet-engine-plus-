<template>
  <div>
    <c-form
      label-width="100px"
      :model="form"
      ref="form"
      :rules="rules"
      :readonly="isReadonly"
    >
      <div v-if="fields.length > 0">
        <div v-for="(item, key) in fields" :key="key">
          <c-form-string
            v-if="item.inputType === 'string' || !item.inputType"
            :key="key"
            :label="item.label"
            :placeholder="$t('pleaseEnter', [item.label])"
            :rules="setItemRule(item.required)"
            :prop="item.prop"
            v-model="form[item.prop]"
            class="el-item-width"
          ></c-form-string>
          <c-form-enum
            v-if="item.inputType === 'enum'"
            :label="item.label"
            :key="key"
            v-model="form[item.prop]"
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
            label="枚举值"
            v-if="item.prop === 'options'"
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
        <el-button type="primary" v-debounce="[saveForm, 'click', 500]">{{ $t('btn.save') }}</el-button>
      </el-form-item>
    </c-form>
  </div>
</template>
<script>
export default {
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
      api: {},
      form: {},
      rules: {
        noEmpty: [
          { required: true, message: this.$t('message.noEmpty'), trigger: ['blur', 'change'] }
        ]
      },
      optionForm: []
    }
  },
  methods: {
    hancleAddOption () {
      this.optionForm.push({
        label: '',
        value: ''
      })
    },
    handleDeleteOption (key) {
      this.optionForm.splice(key, 1)
    },
    setItemRule (required) {
      const rule = required ? this.rules.noEmpty : []
      return rule
    },
    parseFormField (menu) {
      const fields = this.$constants.evil(menu.fields)
      this.api = this.$constants.evil(menu.api)
      this.fields = this.baseIndex.disposalField(fields, 3)
      if (this.id) {
        this.fetchData()
      }
    },
    fetchData () {
      const params = {}
      params[this.baseIndex.primaryKey] = this.id
      this.$service.fetch({
        method: 'get',
        url: this.api.detail[0],
        params
      }).then(data => {
        this.form = data
        // eslint-disable-next-line no-eval
        this.optionForm = eval('(' + data.options + ')')
      })
    },
    saveForm () {
      this.$refs.form.$refs.form.validate(valid => {
        if (valid) {
          const form = JSON.parse(JSON.stringify(this.form))
          form.options = JSON.stringify(this.optionForm)
          if (form.id) {
            this.$service.fetch({
              method: this.api.update[1],
              url: this.api.update[0],
              data: form
            })
              .then(() => {
                this.$message.success(this.$t('message.editSuccess'))
                this.$emit('upsert-end')
              })
              .catch(res => {
                if (res.message) {
                  this.$message.error(res.message)
                }
              })
          } else {
            this.$service.fetch({
              method: this.api.add[1],
              url: this.api.add[0],
              data: form
            }).then(() => {
              this.$message.success(this.$t('message.newSuccess'))
              this.$emit('upsert-end')
            })
              .catch(res => {
                if (res.message) {
                  this.$message.error(res.message)
                }
              })
          }
        }
      })
    }
  },
  created () {
    this.mode === 'read' ? this.isReadonly = true : this.isReadonly = false
    this.parseFormField(this.menu)
  }
}
</script>
<style lang="stylus" scoped>
.enum-value
  padding-top 15px
  background #f2f2f2
</style>
