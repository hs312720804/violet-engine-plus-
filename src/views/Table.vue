<template>
  <el-button type="primary">el-button</el-button>

  <!-- <el-table
    :data="tableData1"
    style="width: 100%">
    <el-table-column
      prop="date"
      label="日期"
      width="180">
    </el-table-column>
    <el-table-column
      prop="name"
      label="姓名"
      width="180">
    </el-table-column>
    <el-table-column
      prop="address"
      label="地址">
    </el-table-column>
  </el-table> -->

  <c-table
    :data="table.data"
    :props="table.props"
    :header="table.header"
    :selection-type="table.selectionType"
    :selected="table.selected"
    :select-on-row-click="true"
    :row-index-disable-selection="[1]"
    :use-context-menu="true"
    @row-selection-add="handleRowSelectionAdd"
    @row-selection-remove="handleRowSelectionRemove"
    @row-selection-change="handleRowSelectionChange"
    @all-row-selection-change="handleAllRowSelectionChange"
    @row-click="handleRowClick"
  >
  </c-table>
</template>
<script>
// import { createOperationRender } from '../lib/utils/component'
import CTable from '../components/Table.vue'
export default {
  components: {
    CTable
  },
  data () {
    return {
      tableData1: [],
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }],
      table: {
        props: {
          border: true
        },
        header: [
          {
            label: 'ID',
            prop: 'id',
            sortable: false
          },
          {
            label: '名称',
            prop: 'name',
            sortable: true
          },
          {
            label: '操作'
            // render: createOperationRender(this, {
            //   handleRead: '查看',
            //   handleEdit: '编辑',
            //   handleDelete: '删除'
            // })
          }
        ],
        data: [
          {
            id: '1',
            name: '名称1'
          },
          {
            id: '2',
            name: '名称2'
          },
          {
            id: '33',
            name: '名称33'
          }
        ],
        selectionType: 'multiple',
        // selectionType: 'single',
        selected: []
      }
    }
  },
  created() {
    console.log('CTable==', CTable)
  },
  methods: {
    handleEdit ({ $index: index }) {
      this.$message(`编辑第${index + 1}条记录`)
    },
    handleRead ({ $index: index }) {
      this.$message(`阅读第${index + 1}条记录`)
    },
    handleDelete ({ $index: index }) {
      this.$message(`删除第${index + 1}条记录`)
    },
    handleRowSelectionChange (row, index) {
      this.table.selected = index
    },
    handleRowSelectionAdd (item, index) {
      // this.table.selected = this.table.selected.concat(index)
      this.table.selected.push(index)
    },
    handleRowSelectionRemove (item, index) {
      this.table.selected = this.table.selected.filter(item => item !== index)
    },
    handleAllRowSelectionChange (value) {
      if (value) {
        this.table.selected = this.table.data.map((_, index) => index)
      } else {
        this.table.selected = []
      }
    },
    handleRowClick (row, index) {
      console.log(arguments)
      this.$message(`row-click`)
    }
  }
}
</script>
