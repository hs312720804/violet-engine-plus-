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
      }
    }
  },
  created () {
    this.mode === 'read' ? this.isReadonly = true : this.isReadonly = false
    this.parseFormField(this.menu)
  },
  methods: {
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
      })
    },
    saveForm () {
      this.$refs.form.$refs.form.validate(valid => {
        if (valid) {
          const form = JSON.parse(JSON.stringify(this.form))
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
  }
}
</script>
