<template>
  <div class="display-inline-block">
    <div class="role-access-setter">
      <div
        v-for="(item, index) in resources"
        :key="index"
        class="resource-item"
      >
        <div class="resource-name">
          {{ item.name }}
        </div>
        <div class="resource-operations">
          <el-checkbox
            v-for="(opItem, opIndex) in item.operations"
            :key="opIndex"
            :value="accessIndexed[opItem.id]"
            @input="handleToggleAccessStatus(opItem, $event)"
          >
            {{ opItem.name }}
          </el-checkbox>
        </div>
      </div>
    </div>
    <div slot="footer" class="footer">
      <el-button type="primary" @click="handleSave">保存</el-button>
      <el-button @click="handleCancel">取消</el-button>
    </div>
  </div>
</template>

<script>
import { ref, watch } from '@vue/composition-api'
import { service } from '@/views/modules'
import consts from '@/utlis/consts'
export default {
  props: ['menu', 'row'],
  setup (props, ctx) {
    const service = ctx.root.$service
    const api = consts.evil(props.menu.api)
    const accessIndexed = ref({})
    function getInitAccessIndexed (accesses) {
      return accesses.reduce((result, item) => {
        result[item.resourceOperationId] = true
        return result
      }, {})
    }
    const resources = ref([])
    function fetchData () {
      service.fetch(
        {
          method: api.resourceList[1],
          url: api.resourceList[0],
          params: { pageNo: 1, pageSize: 9999 }
        }
      ).then(result => {
        resources.value = result.list
      })
      // service.resourceGetList({ pageNo: 1, pageSize: 9999 }).then(result => {
      //   resources.value = result.rows
      // })
    }
    function handleShowDialog () {
      resources.value = []
      accessIndexed.value = getInitAccessIndexed(props.row.roleResourceAccesses)
      fetchData()
    }
    function handleCancel () {
      ctx.emit('set-cancel')
    }
    function handleSave () {
      const role = props.row
      const accessIndexedValue = accessIndexed.value
      const ids = Object.keys(accessIndexedValue).filter(item => accessIndexedValue[item]).join(',')
      service.roleAccessUpsert({ roleId: role.id, resourceOperationsId: ids, resourceType: 'FUNCTION' }, '操作成功')
        .then(() => {
          ctx.emit('set-end')
        })
    }

    function handleToggleAccessStatus (item, val) {
      accessIndexed.value[item.id] = val
    }
    // handleShowDialog()
    watch(() => props.row, () => {
      handleShowDialog()
    })
    return {
      handleShowDialog,
      handleCancel,
      handleSave,
      resources,
      accessIndexed,
      handleToggleAccessStatus
    }
  }
}
</script>

<style lang="stylus" scoped>
.display-inline-block
  display inline-block
.resource-item
  margin 15px 0
.resource-name
  margin 10px 0
  font-size 14px
  font-weight bold
.resource-operations
  font-size  14px
.footer
  padding 10px
  text-align right
</style>
