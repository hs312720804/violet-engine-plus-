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
        this.$sevice.fetch({
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
    rowDelete (row) {
      this.$confirm('确定要删除吗, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        // 实际应用时请用下面的代码
        // this.$sevice.fetch({
        //   method: 'post',
        //   url: this.api.delete,
        //   data: [row.id]
        // }).then(() => {
        //   this.$message({
        //     type: 'success',
        //     message: '删除成功!'
        //   })
        // })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleRefresh () {
      this.fetchData()
    }
  }
}
export default mixin
