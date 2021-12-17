<template>
  <el-dialog v-model="dialogVisible" title="日期/时间格式">
    <el-form>
      <el-form-item label="格式：" :label-width="formLabelWidth">
        <el-input v-model="dateFormat" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">{{ $t('btn.cancel') }}</el-button>
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
  data () {
    return {
      dialogVisible: false,
      dateFormat: '',
      formLabelWidth: '60px'
    }
  },
  watch: {
    'field': 'initOptions'
  },
  created () {
    this.dateFormat = this.field.format
  },
  methods: {
    initOptions (val) {
      this.dateFormat = val.format
    },
    handleConfirm () {
      this.field.format = this.dateFormat
      this.dialogVisible = false
    }
  }

}
</script>

<style lang="stylus" scoped>
:deep(.el-dialog__body)
  padding 20px 20px 10px
  :deep(.el-select)
    width auto
</style>
