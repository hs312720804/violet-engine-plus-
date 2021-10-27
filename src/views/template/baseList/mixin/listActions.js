var mixin = {
  methods: {
    batchDelete () {
      if (this.selected < 1) {
        this.$message({
          type: 'error',
          message: '请选择数据，再删除'
        })
        return
      }
      this.$confirm('确定要删除吗, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$service.fetch({
          method: 'post',
          url: this.api.delete
        })
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
        this.$emit('go-back')
      })
    },
    batchDeleteUser () {
      if (this.selected < 1) {
        this.$message({
          type: 'error',
          message: '请选择数据，再删除'
        })
        return
      }
      this.$confirm('确定要删除吗, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$service.fetch({
          method: this.api.delete[1],
          url: this.api.delete[0]
        })
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
        this.$emit('go-back')
      })
    },
    rowDelete ({ data, params, isJSON = true }) {
      this.$confirm('确定要删除吗, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$service.fetch({
          method: this.api.delete[1],
          url: this.api.delete[0],
          data,
          params,
          isJSON
        }).then((e) => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.fetchData()
        }).catch((e) => {
          this.$notify.error({
            title: '错误提示',
            message: e.message
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 删除角色
    roleDelete (row) {
      this.rowDelete(
        {
          params: {
            roleId: row[this.baseIndex.primaryKey]
          }
        }
      )
    },
    // 删除用户
    userDelete (row) {
      this.rowDelete(
        {
          params: {
            userId: row[this.baseIndex.primaryKey]
          }
        }
      )
    },
    handleRefresh () {
      this.fetchData()
    }
  }
}
export default mixin
