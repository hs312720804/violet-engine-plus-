<template>
  <div>
    <vue-tinymce
      v-model="content"
      :setup="setup"
      :setting="setting"
    ></vue-tinymce>
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
            :placeholder="'请填写' + item.label"
            :rules="rules[item.prop]"
            :prop="item.prop"
            v-model.number="form[item.prop]"
            class="el-item-width"
          ></c-form-string>
          <c-form-enum
            v-if="item.inputType === 'enum'"
            :label="item.label"
            :key="key"
            v-model="form[item.prop]"
            type="radio"
            :prop="item.prop"
            :rules="rules.noEmpty"
            :options="item.options"
          ></c-form-enum>
          <el-form-item
            v-if="item.inputType === 'date'"
            :label="item.label"
          >
            <el-date-picker
              v-model="form[item.prop]"
              type="date"
              placeholder="选择日期"
            >
            </el-date-picker>
          </el-form-item>
        </div>
      </div>
      <el-form-item v-if="!isReadonly">
        <el-button type="success" @click="$emit('go-back')">取消</el-button>
        <el-button type="primary" @click="saveForm()">保存</el-button>
      </el-form-item>
    </c-form>
  </div>
</template>
<script>
export default {
  inject: ['baseIndex'],
  props: ['mode', 'id', 'menuId', 'menu'],
  components: {
  },
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
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ]
      },
      content: '<p>html content</p>',
      setting: {
        height: 500
      }
    }
  },
  methods: {
    setup (editor) {
      console.log(editor)
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
              method: 'post',
              url: this.api.update,
              data: form
            })
              .then(() => {
                this.$message.success('编辑成功')
                this.$emit('upsert-end')
              })
          } else {
            this.$service.fetch({
              method: 'post',
              url: this.api.add,
              data: form
            }).then(() => {
              this.$message.success('新建成功')
              this.$emit('upsert-end')
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
