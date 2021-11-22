<template>
  <div class="display-inline-block">
    <el-transfer
      :value="row.roleIds || []"
      @input="row.roleIds = $event"
      filterable
      @change="handleRoleChange"
      :props="{key: 'id', label: 'name'}"
      :data="roles"
      :titles="['所有角色', '用户拥有的角色']"
    >
    </el-transfer>
  </div>
</template>

<script>
import { ref, watch } from '@vue/composition-api'
// import { service } from '../utlis/deps'
export default {
  components: {
  },
  props: ['row'],
  setup (props, ctx) {
    const service = ctx.root.$service
    const inited = ref(false)
    const roles = ref([])
    function handleShowDialog () {
      if (!inited.value) {
        inited.value = true
      }
      roles.value = []
      fetchRoles()
    }
    function handleBack () {
    }

    function fetchRoles () {
      service.roleGetList({ pageNo: 1, pageSize: 10000 }).then(result => {
        roles.value = result.rows
      })
    }
    function handleRoleChange (val, direction, diff) {
      const user = props.user
      if (direction === 'right') {
        service.userRoleAdd({ userId: user.id, roleIds: diff }, '操作成功')
      } else {
        service.userRoleDel({ userId: user.id, roleIds: diff }, '操作成功')
      }
    }
    // watch(()user, fetchRoles, { lazy: true })
    handleShowDialog()
    return {
      inited,
      handleShowDialog,
      handleBack,

      roles,
      handleRoleChange
    }
  }
}
</script>

<style lang="stylus" scoped>
.display-inline-block
  display inline-block
.footer
  padding 10px
  text-align right
</style>
