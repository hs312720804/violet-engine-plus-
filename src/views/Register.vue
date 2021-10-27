<template>
  <div class="register">
    <el-card class="reg-main" shadow="never">
      <div slot="header" class="clearfix">
        <span>注册</span>
      </div>
      <c-form
        label-width="120px"
        :model="form"
        :readonly="isReadonly"
        :rules="rules"
        ref="form"
      >
        <c-form-string label="登录名" prop="loginName" v-model="form.loginName"></c-form-string>
        <c-form-string label="姓名" prop="name" v-model="form.name"></c-form-string>
        <c-form-string label="密码" prop="password" v-model="form.password"></c-form-string>
        <c-form-string label="邮箱" prop="email" v-model="form.email"></c-form-string>
        <c-form-string label="手机号" prop="phone" v-model="form.phone"></c-form-string>
        <div class="submit">
          <el-button type="primary" @click="handleRegister">注册</el-button>
          <el-button @click="handleCancelRegister">取消</el-button>
        </div>
      </c-form>
    </el-card>
  </div>
</template>
<script>
export default {
  data () {
    return {
      isReadonly: false,
      form: {
        loginName: '',
        name: '',
        password: '',
        email: '',
        phone: ''
      },
      rules: {
        loginName: [{ required: true, message: '不能为空', trigger: 'blur' }],
        name: [{ required: true, message: '不能为空', trigger: 'blur' }],
        password: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { validator: this.checkPassword }
        ],
        email: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        phone: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { validator: this.checkPhone }
        ]
      }
    }
  },
  methods: {
    checkPhone (rule, value, callback) {
      if (!this.$cUtils.validate.isMobile(value)) {
        callback(new Error('请输入正确的手机号码'))
      } else {
        callback()
      }
    },
    checkPassword (rule, value, callback) {
      if (!this.form.id) {
        if (!/^[^\u4e00-\u9fa5]{0,}$/.test(value)) {
          callback(new Error('请输入非中文字符'))
        } else if (value.length < 8 || value.length > 16) {
          callback(new Error('密码长度8-16位'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    },
    handleCancelRegister () {
      this.$router.push({ path: '/' })
    },
    handleRegister () {
      this.$refs.form.$refs.form.validate((valid) => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
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
  >>>.el-card__header
    font-size 16px
    font-weight normal
    margin 0
    text-align center
    padding 16px
.submit
  text-align center
</style>
