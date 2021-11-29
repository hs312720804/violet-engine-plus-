import { onMounted, onUnmounted, onActivated } from 'vue'
import { ElTable } from 'element-plus'
import { ListTabLe } from './usePageDataInit'


interface BaseListParams<T> {
  elTableComp: InstanceType<typeof ElTable>
  table: ListTabLe<T>
}

export default function useTableResize<T> ({ elTableComp, table }: BaseListParams<T>) {

  // ========================= table 自适应高度 =========================

  function listHeightChange () {
    const elTable = document.querySelector<HTMLDivElement>('.el-table') // ? document.querySelector('.el-table') : ''
    const height = document.querySelector('.el-main')?.clientHeight
    if (!height) {
      table.props = {
        ...table.props
        // 'max-height': this.$store.state.app.listHeight
      }
      // this.tableDoLayout()
    } else {
      if (elTable) {
        elTable.style.maxHeight = (height - 107) + 'px'
      }
    }
  }

  function setHeight () {
    // const tableEl = this.$refs.table.$refs.table.$el
    const tableRect = elTableComp.$el.getBoundingClientRect()
    const height = window.innerHeight - tableRect.top - 76
    table.props = {
      maxHeight: height,
      height: height
    }
    elTableComp.doLayout()
  }

  window.addEventListener('resize', setHeight)
  onMounted(() => {
    setHeight()
  })
  onUnmounted(() => {
    window.removeEventListener('resize', setHeight)
  })
  onActivated(() => {
    listHeightChange()
  })

}
