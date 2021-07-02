<template>
  <el-dialog :title="$t('enumSet')" :visible.sync="dialogOptionVisible">
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
          <el-button type="text" icon="el-icon-delete" @click="handleDeleteOption(key)"></el-button>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogOptionVisible = false">{{ $t('btn.cancel') }}</el-button>
      <el-button type="primary" @click="handleConfirm">{{ $t('btn.ok') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    field: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  watch: {
    'field': 'initOptions'
  },
  data () {
    return {
      dialogOptionVisible: false,
      optionForm: [
        // {
        //   label: '',
        //   value: ''
        // }
      ],
      formLabelWidth: '60px'
    }
  },
  methods: {
    initOptions (val) {
      this.optionForm = val.options
    },
    hancleAddOption () {
      this.optionForm.push({
        label: '',
        value: ''
      })
    },
    handleConfirm () {
      this.field.options = this.optionForm
      this.dialogOptionVisible = false
    },
    handleDeleteOption (key) {
      this.optionForm.splice(key, 1)
    }
  },
  created () {
    this.optionForm = this.field.options
  }

}
</script>

<style lang="stylus" scoped>
>>>.el-dialog__body
  padding 20px 20px 10px
</style>
