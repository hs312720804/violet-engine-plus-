<template>
  <el-dialog v-model:visible="dialogOptionVisible" :title="$t('enumSet')">
    <el-tabs v-model="enumType" type="card" @tab-click="handleClick">
      <el-tab-pane label="自定义" name="custom">
        <el-form>
          <el-row v-if="optionForm.length < 1">
            <el-col style="padding-bottom:18px;">
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
              <el-button
                type="text"
                icon="el-icon-circle-plus-outline"
                @click="hancleAddOption"
              ></el-button>
            </el-col>
          </el-row>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="枚举字典" name="dictionaries">
        <el-select v-model="value" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-tab-pane>
    </el-tabs>

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
  data () {
    return {
      enumType: 'custom',
      dialogOptionVisible: false,
      optionForm: [
        // {
        //   label: '',
        //   value: ''
        // }
      ],
      formLabelWidth: '60px',
      options: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }],
      value: ''
    }
  },
  watch: {
    'field': 'initOptions'
  },
  created () {
    this.optionForm = this.field.options
  },
  methods: {
    initOptions (val) {
      this.optionForm = val.options ? val.options : []
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
  }

}
</script>

<style lang="stylus" scoped>
>>>.el-dialog__body
  padding 20px 20px 10px
  >>>.el-select
    width auto
</style>
