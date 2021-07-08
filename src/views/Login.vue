<template>
  <div class="login-container">
    <el-row style="margin:auto; width:100%; height: 600px">
      <el-col class="login-form1">
        <div class="log_center">
          <div class="log_logo">
            <img v-if="image" :src="image">
            <img v-else src="../assets/logo.png">
            <span>{{ siteInfo.siteName }}</span>
          </div>
          <div class="log_bj">
            <div class="formRadio">
              <el-tabs v-model="loginType" :stretch="true" @tab-click="handleSelectLoginType">
                <el-tab-pane label="管理员登录" name="admin"></el-tab-pane>
                <!-- <el-tab-pane label="员工入职登录" name="employee"></el-tab-pane> -->
              </el-tabs>
            </div>
            <el-form
              v-if="!loginType || loginType === 'admin'"
              ref="adminForm"
              :model="adminForm"
              status-icon
              class="demo-adminForm"
              @keyup.enter.native="handleLogin"
            >
              <el-form-item
                prop="userName"
                :rules="[
                  { required: true, message: '帐号不能为空', trigger: 'change'}
                ]"
              >
                <div class="formInput">
                  <span class="icon el-icon-user"></span>
                  <el-input v-model="adminForm.userName" auto-complete="off" placeholder="请输入帐号"></el-input>
                  <span v-if="adminForm.loginType" class="mail-after">@coocaa.com</span>
                </div>
              </el-form-item>
              <el-form-item
                prop="password"
                :rules="[
                  { required: true, message: '密码不能为空', trigger: 'change'}
                ]"
              >
                <div class="formInput">
                  <span class="icon el-icon-lock"></span>
                  <el-input
                    v-model="adminForm.password"
                    type="password"
                    auto-complete="off"
                    placeholder="请输入密码"
                  ></el-input>
                </div>
              </el-form-item>
              <el-form-item>
                <div class="formSubmit">
                  <el-row :gutter="14">
                    <el-col :span="12"><el-button type="primary" @click="handleLogin">{{ $t('btn.login') }}</el-button></el-col>
                    <el-col :span="12"><el-button @click="handleRegister">{{ $t('btn.register') }}</el-button></el-col>
                  </el-row>
                </div>
              </el-form-item>
            </el-form>
            <el-form v-if="loginType === 'employee'" ref="employeeForm" :model="employeeForm">
              <el-form-item
                prop="phone"
                :rules="[
                  { required: true, message: '手机号不能为空', trigger: 'change'}
                ]"
              >
                <div class="formInput">
                  <span class="icon el-icon-mobile-phone"></span>
                  <el-input v-model="employeeForm.phone" auto-complete="off" placeholder="请输入面试阶段使用的手机号"></el-input>
                </div>
              </el-form-item>
              <el-form-item
                prop="verifyCode"
              >
                <div class="formInput">
                  <span class="icon el-icon-key"></span>
                  <el-input v-model="employeeForm.verifyCode " auto-complete="off" placeholder="请输入验证码"></el-input>
                  <div class="verify-btn">
                    <el-button @click="getVerifyCode">获取验证码</el-button>
                  </div>
                </div>
              </el-form-item>
              <el-form-item>
                <div class="formSubmit">
                  <el-button type="primary" @click="handleLogin">提交</el-button>
                </div>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </el-col>
    </el-row>
    <div class="via">
      Copyright ©{{ year }} {{ siteInfo.copyright }} ·  <template v-if="siteInfo.recordNum">ICP备案证号：<a href="https://beian.miit.gov.cn/" target="_blank">{{ siteInfo.recordNum }}</a></template>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

import { ElForm } from 'element-plus'
import { LoginService, LoginArg } from '@/services/login'
import { getInitData } from '@/auth'

export default defineComponent({
  setup() {
    const $router = useRouter()
    const loginType = ref('admin')
    const adminForm = reactive<LoginArg>({
      userName: 'admin',
      password: '12345678'
    })
    const employeeForm = reactive({
      phone: '',
      verifyCode: ''
    })
    const adminFormEl = ref<InstanceType<typeof ElForm>>()
    const employeeFormEl = ref<InstanceType<typeof ElForm>>()

    const formSchema = ref('')
    const siteInfo = ref('')
    const image = ref('')
    const year = ref(2021)

    const handleLogin = ()=>{

      if (loginType.value === 'admin') {
        LoginService(adminForm)
          .then(getInitData)
          .then(()=> {
            $router.push('/')
          })
      } else {

      }
    }

    const getVerifyCode = ()=> {
      console.log(employeeFormEl.value)
      employeeFormEl.value?.validate(isValid => {
        if (isValid) {
          // this.$service.getValidateCode({ phone: employeeForm.phone }).then(() => {
          //   debugger
          // })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }

    const handleRegister = () => {
      $router.push({ name: 'register' })
    }

    return {
      loginType,
      adminForm,
      employeeForm,
      adminFormEl,
      employeeFormEl,
      handleLogin,
      getVerifyCode,
      handleRegister,
      formSchema,
      siteInfo,
      image,
      year
    }

    // props: ['schema'],

    // computed: {
    //   formSchema () {
    //     let schema
    //     return this.schema || schema
    //   },
    //   siteInfo () {
    //     return this.$store.state.app.site
    //   },
    //   logo () {
    //     return this.$constants.evil(this.$store.state.app.site.logo)
    //   },
    //   year () {
    //     return this.$moment().format('YYYY')
    //   }
    // },

  }
  // created() {
  //   alert(123)
  // }
})
</script>
<style lang="stylus">
.log_center
  width 380px
  height 430px
  position fixed
  left 50%
  top 50%
  display inline-block
  margin-top -250px
  margin-left -200px
  z-index 2
.log_logo
  width 100%
  text-align center
  margin-bottom 15px
.log_logo img
  width 70%
.log_logo span
  display block
  color #ffffff
  font-size 18px
  line-height 36px
.log_logo small
  font-size 12px
.log_bj
  width 100%
  height 310px
  background #fff
  border-radius 9px
  opacity 0.8
  padding-top 10px
.formInput
  width 90%
  margin 0 auto
  position relative
  border-bottom 1px solid #e7e7e7
  padding-bottom 5px
.formInput span.icon
  width 50px
  height 50px
  line-height 50px
  display block
  position absolute
  left 0
  top 0
  z-index 100
  font-size 24px
  text-align center
  color #fc4c02
.login-form1 .formInput .el-input__inner
  padding-left 50px
  height 50px
  border 0
  line-height 50px
  font-size 16px
  color #000
  outline none
input:-webkit-autofill
  -webkit-box-shadow 0 0 0px 1000px white inset !important
.formSubmit
  text-align center
  padding-top 10px
  margin 0 20px
.formSubmit .el-button
  height 46px
  margin 0 auto
  font-size 16px
  width 100%
.formSubmit .el-button--primary
  background #fc4c02
  color #ffffff
  border none
.formSubmit .el-button--primary:hover
  background-color #d84609
.validateCodeImg
  width 70px
  height 30px
  position absolute
  right 0
  top 15px
  z-index 1000
.log_bj .el-form-item__error
  padding-left 27px
.formRadio
  width 90%
  margin 0 auto
  .el-tabs__item.is-active
    color #fc4c02
  .el-tabs__item
    line-height 54px
    height 54px
  .el-tabs__item:hover
    color #fc4c02
</style>
<style lang="stylus" scoped>
.mail-after
  font-size 20px
  display block
  position absolute
  right 30px
  top 0
  line-height 50px
@media screen and (max-width: 800px)
  .log_center
    width 85%
    margin-left -42.5%
.via
  position absolute
  bottom 20px
  left 0
  text-align center
  width 100%
  color #ccc
  z-index 15
  a
    color #ccc
    text-decoration none
    &:hover
      text-decoration underline
.login-container
  display flex
  height 100%
  align-items center
  position relative
  justify-content space-around
  background url("~@/assets/images/lockLogin.png") no-repeat
  background-size cover
.login-container:before
  background rgba(0,0,0,.3)
  position absolute
  left 0
  top 0
  display block
  width 100%
  height 100%
  z-index 1
  content ''
>>>.el-tabs__active-bar
  background-color #fc4c02
.verify-btn
  position absolute
  right 0
  top 8px
</style>
