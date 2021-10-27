<template>
  <div class="display-inline-block">
    <el-transfer
      :value="row.roleIds || []"
      filterable
      :props="{ key: 'id', label: 'name' }"
      :data="roles"
      :titles="['所有角色', '用户拥有的角色']"
      @input="handleRoleInput"
      @change="handleRoleChange"
    ></el-transfer>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, PropType, watch } from 'vue'
import { roleGetList, RBACRole } from '@/services/role'
import { userRoleAdd, userRoleDel, RBACUser } from '@/services/user'

// interface IRoleData {
//   key:string
//   label:string
//   disabled:boolean
// }

export default defineComponent({
  components: {
  },
  props: {
    row: {
      type: Object as PropType<RBACUser>,
      default: () => {
        return {}
      }
    }
  },
  setup (props) {
    const inited = ref(false)
    const showDialog = ref(false)
    const roles = ref<Array<RBACRole>>([])
    function handleShowDialog () {
      if (!inited.value) {
        inited.value = true
      }
      roles.value = []
      fetchRoles()
      showDialog.value = true
    }
    function handleBack () {
      showDialog.value = false
    }

    function fetchRoles () {
      roleGetList({ pageNo: 1, pageSize: 10000 }).then(result => {
        roles.value = result.rows
      })
    }
    function handleRoleChange (val: number, direction: 'left' | 'right', movedKeys: Array<number>) {
      const user = props.row
      if (direction === 'right') {
        userRoleAdd({ userId: user.id, roleIds: movedKeys }, '操作成功')
      } else {
        userRoleDel({ userId: user.id, roleIds: movedKeys }, '操作成功')
      }
    }
    function handleRoleInput(val:Array<number>){
      // eslint-disable-next-line vue/no-mutating-props
      props.row.roleIds.splice(0,props.row.roleIds.length)
      // eslint-disable-next-line vue/no-mutating-props
      props.row.roleIds.push(...val)
    }

    watch(() => props.row, handleShowDialog, { immediate: true })

    return {
      inited,
      showDialog,
      handleShowDialog,
      handleBack,

      roles,
      handleRoleChange,
      handleRoleInput
    }
  }
})
</script>

<style lang="stylus" scoped>
.display-inline-block
  display inline-block
.footer
  padding 10px
  text-align right
</style>
