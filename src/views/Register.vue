<template>
  <div class="register">
    <el-card class="reg-main" shadow="never">
      <template #header class="clearfix">
        <span>注册</span>
      </template>
      <c-form
        ref="formEl"
        label-width="120px"
        :model="form"
        :readonly="isReadonly"
        :rules="rules"
      >
        <c-form-string v-model="form.loginName" label="登录名" prop="loginName"></c-form-string>
        <c-form-string v-model="form.name" label="姓名" prop="name"></c-form-string>
        <c-form-string v-model="form.password" label="密码" prop="password"></c-form-string>
        <c-form-string v-model="form.email" label="邮箱" prop="email"></c-form-string>
        <c-form-string v-model="form.phone" label="手机号" prop="phone"></c-form-string>
        <div class="submit">
          <el-button type="primary" @click="handleRegister">注册</el-button>
          <el-button @click="handleCancelRegister">取消</el-button>
        </div>
      </c-form>
    </el-card>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElForm } from 'element-plus'
import { FormRulesMap } from 'element-plus/lib/el-form/src/form.type'
import CUtils from '@ccprivate/utils'
import { CForm } from '@ccprivate/admin-toolkit-plus'
export default defineComponent({
  setup () {
    const router = useRouter()
    const formEl = ref<InstanceType<CForm>>()
    const rules: FormRulesMap = {
      loginName: [{ required: true, message: '不能为空', trigger: 'blur' }],
      name: [{ required: true, message: '不能为空', trigger: 'blur' }],
      password: [
        { required: true, message: '不能为空', trigger: 'blur' },
        {
          validator (rule, value, callback) {
            if (!/^[^\u4e00-\u9fa5]{0,}$/.test(value)) {
              callback(new Error('请输入非中文字符'))
            } else if (value.length < 8 || value.length > 16) {
              callback(new Error('密码长度8-16位'))
            } else {
              callback()
            }
          }
        }
      ],
      email: [
        { required: true, message: '不能为空', trigger: 'blur' },
        { type: 'email', message: '请输入正确的邮箱地址', trigger:'blur' }
      ],
      phone: [
        { required: true, message: '不能为空', trigger: 'blur' },
        {
          validator (rule, value, callback) {
            if (!CUtils.validate.isMobile(value)) {
              callback(new Error('请输入正确的手机号码'))
            } else {
              callback()
            }
          }
        }
      ]
    }


    // function checkPhone
    // function checkPassword
    function handleCancelRegister () {
      router.push({ path: '/' })
    }
    function handleRegister () {

      (formEl.value?.$refs.form as InstanceType<typeof ElForm>).validate(valid => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
    return {
      formEl,
      isReadonly: false,
      form: {
        loginName: '',
        name: '',
        password: '',
        email: '',
        phone: ''
      },
      rules,
      handleCancelRegister,
      handleRegister
    }
  }
})
</script>
<style lang="stylus" scoped>
.register
  height 100vh
  background #f2f2f2
  padding-top 20px
.reg-main
  max-width 800px
  margin 0 auto
  background #fff
  :deep(.el-card__header)
    font-size 16px
    font-weight normal
    margin 0
    text-align center
    padding 16px
.submit
  text-align center
</style>
