<template>
  <div>
    <el-form>
      <el-row>
        <el-col style="padding-bottom:18px">
          <el-button @click="hancleAddOption">{{ $t('addValue') }}</el-button>
        </el-col>
      </el-row>
      <el-row v-for="(option, key) in optionForm" :key="key" :gutter="14">
        <el-col :span="11">
          <el-form-item label="label" :label-width="formLabelWidth">
            <el-input v-model="option.label" autocomplete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="value" :label-width="formLabelWidth">
            <el-input v-model="option.value" autocomplete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <el-button type="text" :icon="Delete" @click="handleDeleteOption(key)"></el-button>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">{{ $t('btn.cancel') }}</el-button>
      <el-button type="primary" @click="handleConfirm">{{ $t('btn.ok') }}</el-button>
    </div>
  </div>
</template>

<script>
import { Delete } from '@element-plus/icons-vue'

export default {
  props: {
    menu: {
      type: Object,
      default: () => {
        return {}
      }
    },
    row: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      optionForm: [
        // {
        //   label: '',
        //   value: ''
        // }
      ],
      api: {},
      formLabelWidth: '60px'
    }
  },
  created () {
    this.optionForm = this.row.options ? JSON.parse(this.row.options) : []
    console.log(this.optionForm, this.row)
    this.api = this.menu.api ? JSON.parse(this.menu.api) : {}
  },
  methods: {
    hancleAddOption () {
      this.optionForm.push({
        label: '',
        value: ''
      })
    },
    handleCancel () {
      this.$emit('set-cancel')
    },
    handleConfirm () {
      if (this.validateOptions()) {
        const param = {
          id: this.row.id,
          options: JSON.stringify(this.optionForm)
        }
        this.$service.enumUpdate(param).then(res => {
          this.$message.success('操作成功!')
          this.$emit('set-end')
        })
      }
    },
    validateOptions () {
      return this.optionForm.every(option => {
        if (option.label === '') {
          this.$message.error('选项必填！')
          return false
        }
        if (option.value === '') {
          this.$message.error('选项值必填！')
          return false
        }
        return true
      })
    },
    handleDeleteOption (key) {
      this.optionForm.splice(key, 1)
    }
  }

}
</script>

<style lang="stylus" scoped>
>>>.el-dialog__body
  padding 20px 20px 10px
</style>
