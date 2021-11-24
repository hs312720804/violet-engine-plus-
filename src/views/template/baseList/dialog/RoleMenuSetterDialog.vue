<template>
  <div class="display-inline-block">
    <el-tree
      class="menu-item-list"
      :data="menuTree"
      ref="treeRef"
      show-checkbox
      node-key="id"
      :check-strictly="true"
      :default-checked-keys="roleMenuIds"
      default-expand-all
    >
      <div class="menu-item" slot-scope="{ node, data }">
        <span>{{ data.name }}</span>
      </div>
    </el-tree>
    <div class="footer" slot="footer">
      <el-button type="primary" @click="handleSave">保存</el-button>
      <el-button @click="handleCancel">取 消</el-button>
    </div>
  </div>
</template>

<script>
export default {
  props: ['row'],
  data () {
    return {
      menuTree: [],
      roleMenuIds: []
    }
  },
  watch: {
    'row': 'handleShowDialog'
  },
  methods: {
    handleShowDialog () {
      this.roleMenuIds = this.getMenuIds(this.row.menus)
      console.log(this.roleMenuIds)
      this.fetchMenu()
    },
    getMenuIds (menus) {
      let result = []
      menus.forEach(item => {
        result.push(item.id)
        const children = item.children || []
        if (children.length > 0) {
          result = result.concat(this.getMenuIds(children))
        }
      })
      return result
    },
    fetchMenu () {
      this.menuTree = []
      this.$service.menuGetList().then(result => {
        this.menuTree = result
      })
    },
    handleSave () {
      const roleId = this.row.id
      const menuIds = this.$refs.treeRef.getCheckedKeys().join(',')
      this.$service.roleMenuUpsert({ roleId, menuIds }, '操作成功')
        .then(() => {
          this.$emit('set-end')
        })
    },
    handleCancel () {
      this.$emit('set-cancel')
    }
  },
  created () {
    this.handleShowDialog()
  }
}
</script>

<style lang="stylus" scoped>
.footer
  padding 10px
  text-align right
</style>
