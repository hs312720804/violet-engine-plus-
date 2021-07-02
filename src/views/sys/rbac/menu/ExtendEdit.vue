<template>
  <el-dialog :title="$t('advancedSettings')" :visible.sync="dialogRenderVisible">
    <el-form :model="extendForm" label-width="80px">
      <el-form-item :label="$t('columnWidth')">
        <el-input v-model="extendForm.width" :placeholder="$t('placeholder.columnWidth')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('setPrimaryKey')">
        <el-switch
          v-model="extendForm.primaryKey"
          active-color="#13ce66"
          inactive-color="#eeeeee"
          :active-value="1"
          :inactive-value="0"
          :disabled="disabled"
        >
        </el-switch>
        <span v-if="disabled" style="padding-left:10px;">（{{ $t('message.changePrimaryKey') }}）</span>
      </el-form-item>
      <el-form-item :label="$t('supportsSorting')">
        <el-radio-group v-model="extendForm.sortable">
          <el-radio :label="true">{{ $t('yes') }}</el-radio>
          <el-radio :label="false">{{ $t('no') }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('required')">
        <el-switch
          v-model="extendForm.required"
          active-color="#13ce66"
          inactive-color="#eeeeee"
          :active-value="true"
          :inactive-value="false"
        >
        </el-switch>
        <span style="color:#999; padding-left:30px;">编辑页用到时，配置了才会生效。</span>
      </el-form-item>
      <el-form-item label-width="80px" label="render">
        <div style="margin-bottom:10px;">
          <el-select
            v-model="renderForm.render"
            :placeholder="$t('placeholder.setColumnRender')"
            clearable
          >
            <el-option
              v-for="(item, key) in renderMap"
              :key="key"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <el-input
          v-if="renderForm.render"
          type="textarea"
          :autosize="{ minRows: 5, maxRows: 10}"
          :rows="5"
          :placeholder="$t('placeholder.renderArg')"
          v-model="renderForm.arg"
        >
        </el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogRenderVisible = false">{{ $t('btn.cancel') }}</el-button>
      <el-button type="primary" @click="handleConfirm">{{ $t('btn.ok') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { renderMap } from '@/views/baseList/renderMethods'
export default {
  props: {
    row: {
      type: Object,
      default: () => {
        return {}
      }
    },
    hasPrimaryKey: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    'row': 'initValue'
  },
  data () {
    return {
      dialogRenderVisible: false,
      extendForm: {},
      renderForm: {
        render: '',
        arg: ''
      },
      sortOptions: [
        {
          label: this.$t('yes'),
          value: true
        },
        {
          label: this.$t('no'),
          value: false
        }
      ],
      disabled: false
    }
  },
  computed: {
    renderMap () {
      const options = []
      Object.keys(renderMap).forEach((key) => {
        options.push({
          label: renderMap[key],
          value: '_this.' + key
        })
      })
      return options
    }
  },
  methods: {
    initValue (val) {
      // _this.handleOperation([\"编辑:Page:Edit:update:edit\",\"查看:Page:Edit:detail:read\",\"删除:Todo:rowDelete:delete\",\"自定义Page:Page:AA\",\"DialogPage:Dialog:AAADialog\"])
      this.extendForm = JSON.parse(JSON.stringify(val))
      this.disabled = this.hasPrimaryKey && !this.extendForm.primaryKey
      if (this.extendForm.render) {
        let arr = this.extendForm.render.split('(')
        this.renderForm.render = arr[0]
        this.renderForm.arg = arr[1].substr(0, arr[1].length - 1)
      } else {
        this.renderForm.render = ''
        this.renderForm.arg = ''
      }
    },
    handleConfirm () {
      if (this.renderForm.render) {
        this.renderForm.arg = this.renderForm.arg.trim()
        if (this.renderForm.arg) {
          this.extendForm.render = this.renderForm.render + '(' + this.renderForm.arg + ')'
        } else {
          this.extendForm.render = this.renderForm.render + '()'
        }
        this.row.render = this.extendForm.render
      } else {
        this.row.render = ''
      }
      this.row.width = this.extendForm.width
      this.row.sortable = this.extendForm.sortable
      this.row.primaryKey = this.extendForm.primaryKey
      this.row.required = this.extendForm.required
      this.dialogRenderVisible = false
    }
  },
  created () {
    // this.extendForm = JSON.parse(JSON.stringify(this.row))
    // this.disabled = this.hasPrimaryKey && this.row.primaryKey
  }

}
</script>

<style>

</style>
