<template>
  <div class="display-inline-block">
    <div class="wrapper">
      <Transfer
        id-field="id"
        label-field="name"
        direction="none"
        :titles="['角色用户', '搜索']"
        :left-data="roleUser"
        :right-data="allUser"
      >
        <div slot="left-footer" slot-scope="{currentChecked}" class="role-user-actions">
          <el-button type="primary" :disabled="currentChecked.length === 0" @click="handleRemoveRoleUser(currentChecked)">移除</el-button>
        </div>
        <div slot="right-head">
          <el-input
            v-model="searchKey"
            class="search-input"
            clearable
            placeholder="输入关键字搜索"
          ></el-input>
        </div>
        <div slot="right-footer" slot-scope="{currentChecked}" class="role-user-actions">
          <el-button type="primary" :disabled="currentChecked.length === 0" @click="handleAddRoleUser(currentChecked)">设置为角色用户</el-button>
        </div>
      </Transfer>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'
import Transfer from '@/components/Transfer/Index.vue'
export default {
  components: {
    Transfer
  },
  props: ['row'],
  setup (props, ctx) {
    const service = ctx.root.$service
    const roleName = computed(() => props.row.name)
    const fetchDataMethod = service.userGetList.bind(service)
    const allUser = ref([])
    const roleUser = ref([])
    const roleUserIds = computed(() => {
      return roleUser.value.map(item => item.id)
    })

    const searchKey = ref('')
    function fetchData () {
      const searchKeyValue = searchKey.value
      if (searchKeyValue) {
        const options = {
          pageNo: 1,
          pageSize: 30,
          searchKey: searchKey.value
        }
        fetchDataMethod(options).then(result => {
          allUser.value = result.rows
        })
      } else {
        allUser.value = []
      }
    }

    function handleShowDialog () {
      roleUser.value = props.row.users
      searchKey.value = ''
    }
    function handleCancel () {
      ctx.emit('set-end')
    }

    function handleAddRoleUser (userIds) {
      const roleUserIdsObj = roleUser.value.reduce((result, item) => {
        result[item.id] = true
        return result
      }, {})
      const ids = userIds.filter(item => !roleUserIdsObj[item])
      const addUsers = allUser.value.filter(item => ids.includes(item.id))
      const originRoleUsers = roleUser.value
      roleUser.value = originRoleUsers.concat(addUsers)
      service.roleUserAdd({ roleId: props.row.id, userIds: ids.join(',') }, '操作成功')
        .then(() => {
          ctx.emit('set-change', true)
        })
        .catch(() => {
          roleUser.value = originRoleUsers
        })
    }

    function handleRemoveRoleUser (userIds) {
      const originRoleUsers = roleUser.value
      roleUser.value = originRoleUsers.filter(item => !userIds.includes(item.id))
      service.roleUserRemove({ roleId: props.row.id, userIds: userIds.join(',') }, '操作成功')
        .then(() => {
          ctx.emit('set-change', true)
        })
        .catch(() => {
          roleUser.value = originRoleUsers
        })
    }
    watch(searchKey, fetchData, { lazy: true })
    watch(() => props.row, handleShowDialog)
    // handleShowDialog()
    return {
      handleShowDialog,
      handleCancel,
      searchKey,
      roleName,
      allUser,
      roleUser,
      roleUserIds,
      handleAddRoleUser,
      handleRemoveRoleUser
    }
  }
}
</script>

<style lang="stylus" scoped>
.display-inline-block
  display inline-block
.search-input
  width 190px
  margin 5px auto
  display block
.role-user-actions
  border-top 1px solid #f5f5f5
  padding 5px
  text-align center

</style>
