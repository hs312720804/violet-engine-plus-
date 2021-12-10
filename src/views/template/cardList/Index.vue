
<script lang="ts">
import { defineComponent, ref, provide } from 'vue'
import BaseList from '@/views/template/baseList/Index.vue'
import ResourceList from './List.vue'

import { baseIndexKey } from '@/hooks/baseList/usePageDataInit'
import initBaseListTemplate from '@/hooks/baseList/Index'

export default defineComponent({
  components: {
    ResourceList
  },
  extends: BaseList,
  props: {
    menuId: {
      type: Number,
      required: true
    },
    type: {
      type: String,
      default: ''
    }
  },
  // 和 baseList/Index 一致
  setup (props) {
    const listEL = ref<typeof ResourceList>()

    const {
      menuDetail,
      primaryKey, // 主键
      template,
      title,
      mode,
      optionType,
      id,
      row,
      // selected,
      isShowList,
      dialogVisible,
      handleUpsertEnd,
      handleOption,
      goBack,
      handleDialogChange,
      hiddenDialog,
      fetchMenuData } = initBaseListTemplate<typeof ResourceList>(listEL)

    provide(baseIndexKey, {
      primaryKey
    })
    fetchMenuData(props.menuId)

    return {
      menuDetail,
      primaryKey, // 主键
      template,
      title,
      mode,
      optionType,
      id,
      row,
      // selected,
      isShowList,
      dialogVisible,
      listEL,
      handleUpsertEnd,
      handleOption,
      goBack,
      handleDialogChange,
      hiddenDialog
    }
  }
})

</script>

<style>

</style>
