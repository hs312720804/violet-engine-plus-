<template>
  <div class="account">
    <el-form v-model="form">
      <div class="account-car">
        <div class="account-car__title">帐号信息</div>
        <el-form-item label="头像：" class="avatar-item">
          <el-upload
            class="avatar-uploader"
            action="https://jsonplaceholder.typicode.com/posts/"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="form.imageUrl" :src="form.imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="姓名：">{{ form.name }}</el-form-item>
        <el-form-item label="登录名：">{{ form.loginName }}</el-form-item>
        <el-form-item label="手机：">{{ form.phone }}</el-form-item>
        <el-form-item label="邮箱：">{{ form.email }}</el-form-item>
      </div>
      <div class="account-car">
        <div class="account-car__title">帐号密码</div>
        <el-form-item label="密码：">
          <span style="padding-right:20px">******</span>
          <el-button @click="handleChangePassword">修改密码</el-button>
        </el-form-item>
      </div>
    </el-form>
    <ChangePassword
      v-if="passwordVisible"
      :row="form"
      :visible="passwordVisible"
      @close="dialogClose"
    ></ChangePassword>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import { useStore } from '@/store'
import ChangePassword from '@/components/UserChangePassword.vue'
import { RBACUserInfo, userDetailService } from '@/services/user'
export default defineComponent({
  components: {
    ChangePassword
  },
  setup () {
    const store = useStore()
    const passwordVisible = ref(false)
    const user = computed(() => store.state.user)
    const form = ref<RBACUserInfo>({} as RBACUserInfo)

    fetchDate()

    function handleChangePassword () {
      passwordVisible.value = true
    }
    function dialogClose () {
      passwordVisible.value = false
    }
    function fetchDate () {
      userDetailService({ userId: user.value.id }).then(data => {
        form.value = data
        console.log(data)
      })
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    function handleAvatarSuccess () { }
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    function beforeAvatarUpload () { }

    return {
      form,
      passwordVisible,
      handleChangePassword,
      dialogClose,
      handleAvatarSuccess,
      beforeAvatarUpload
    }
  }
})
</script>

<style lang="stylus" scoped>
.account
  background #fff
  padding-bottom 20px
.account-car
  width 50%
  margin auto
  background #fff
  padding 20px 0 0
  :deep(.el-form-item)
    margin-bottom 10px
    .avatar-uploader .el-upload
      border 1px dashed #d9d9d9
      border-radius 60px
      cursor pointer
      position relative
      overflow hidden
    .avatar-uploader .el-upload:hover
      border-color #409EFF
    .avatar-uploader-icon
      font-size 28px
      color #8c939d
      width 110px
      height 110px
      line-height 110px
      text-align center
    .avatar
      width 110px
      height 110px
      display block
:deep(.avatar-item) .el-form-item__label
  line-height 110px
.account-car__title
  margin 0
  font-size 16px
  border-bottom 1px solid #EBEEF5
  line-height 50px
  margin-bottom 10px
</style>
