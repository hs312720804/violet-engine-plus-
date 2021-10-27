<template>
  <div>
    <el-dialog
      v-model:visible="dialogVisible"
      title="修改密码"
      width="450px"
      :before-close="handleCloseDialog"
      append-to-body
    >
      <el-form
        ref="ruleFormEl"
        :model="ruleForm"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item :label="$t('password')" prop="pass">
          <el-input v-model="ruleForm.pass" type="password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input v-model="ruleForm.checkPass" type="password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm">{{ $t('btn.submit') }}</el-button>
          <el-button @click="resetForm">{{ $t('btn.reset') }}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, PropType } from 'vue'
import { ElForm, ElNotification } from 'element-plus'
// import { FormRulesMap } from 'element-plus/packages/components/form/src/form.type'
import { FormRulesMap } from 'element-plus/lib/el-form/src/form.type'
import { UserInfo, userUpsert } from '@/services/user'


export default defineComponent({
  props: {
    row: {
      type: Object as PropType<UserInfo>,
      default: () => {
        return {}
      }
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close'],
  setup (props, { emit }) {

    const dialogVisible = ref(props.visible)
    const ruleForm = reactive({ pass: '', checkPass: '' })
    const ruleFormEl = ref<InstanceType<typeof ElForm>>()
    const rules: FormRulesMap = {
      pass: [
        {
          validator: (rule, value: string, callback) => {
            if (value === '') {
              return callback(new Error('请输入密码'))
            } else if (!/^[^\u4e00-\u9fa5]{0,}$/.test(value)) {
              return callback(new Error('请输入非中文字符'))
            } else if (value.length < 8 || value.length > 16) {
              return callback(new Error('请输入8-16位非汉字字符'))
            } else {
              if (ruleForm.checkPass !== '') {
                ruleFormEl.value?.validateField('checkPass', callback)
              }
              return callback()
            }
          }, trigger: 'blur'
        }
      ],
      checkPass: [
        {
          validator: (rule, value: string, callback) => {
            if (value === '') {
              callback(new Error('请再次输入密码'))
            } else if (!/^[^\u4e00-\u9fa5]{0,}$/.test(value)) {
              callback(new Error('请输入非中文字符'))
            } else if (value !== ruleForm.pass) {
              callback(new Error('两次输入密码不一致!'))
            } else {
              callback()
            }

          }, trigger: 'blur'
        }
      ]
    }

    function submitForm () {
      ruleFormEl.value?.validate(valid => {
        if (valid) {
          const { id, status, departmentId } = props.row
          userUpsert({
            id,
            status,
            departmentId,
            password: ruleForm.pass
          }).then(() => {
            ElNotification({
              type: 'success',
              title: '成功',
              message: '修改密码成功'
            })
            handleCloseDialog()
          }).catch(() => {
            ElNotification({
              type: 'error',
              title: '失败',
              message: '修改密码失败'
            })
          })
        } else {
          return false
        }
      })
    }
    function resetForm () {
      ruleFormEl.value?.resetFields()
    }
    function handleCloseDialog () {
      emit('close', false)
    }
    return {
      dialogVisible,
      ruleForm,
      ruleFormEl,
      rules,
      submitForm,
      resetForm,
      handleCloseDialog
    }
  }
})
</script>

<style>
</style>
