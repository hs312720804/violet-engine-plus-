<template>
  <el-dialog v-model="dialogOptionVisible" :title="$t('enumSet')">
    <div class="enum-select">
      <div class="select">
        <el-select v-model="selectEnum" placeholder="请选择">
          <el-option
            v-for="item in enumOptions"
            :key="item.id"
            :label="item.enumName"
            :value="item.enumCode"
          >
          </el-option>
        </el-select>
      </div>
      <div class="add-enum">
        <el-button @click="handleAddEnum">新建</el-button>
      </div>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogOptionVisible = false">{{ $t('btn.cancel') }}</el-button>
        <el-button type="primary" @click="handleConfirm">{{ $t('btn.ok') }}</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import { enumList } from '@/services/enum'
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
      dialogOptionVisible: false,
      enumOptions: [],
      selectEnum: ''
    }
  },
  watch: {
    'field': 'initOptions'
  },
  created () {
    debugger
    this.selectEnum = this.field.options
  },
  methods: {
    initOptions (val) {
      this.selectEnum = val.options ? val.options : ''
    },
    fetchEnumList () {
      enumList(
        {
          pageNo: 1,
          pageSize: 999
        }
      ).then(data => {
        this.enumOptions = data.list
      })
    },
    handleConfirm () {
      this.field.options = this.selectEnum
      this.dialogOptionVisible = false
    },
    handleAddEnum () {
      this.dialogOptionVisible = false
      this.$router.push({ name: 'enum' })
    }
  }

}
</script>

<style lang="stylus" scoped>
>>>.el-dialog__body
  padding 20px 20px 10px
  >>>.el-select
    width auto
.enum-select
  display flex
  .select
    flex 1
.add-enum
  width 66px
  text-align right
</style>
