<template>
  <div style="height:100%;">
    <iframe
      v-if="iframeSrc"
      :src="iframeSrc"
      width="100%"
      height="100%"
      frameborder="0"
    ></iframe>
  </div>
</template>
<script>
import { defineComponent,ref } from 'vue'
import { getMenusDetailService } from '@/services/menu'
import { evil as functionEvil } from '@/utlis/common'
export default defineComponent({
  props: {
    menuId: {
      type: Number,
      required: true
    }
  },
  setup(props) {
    let menuDetail = ref({})
    let iframeSrc = ref('')
    fetchMenuData(props.menuId)

    function fetchMenuData (id) {
      getMenusDetailService({ id }).then(data => {
        menuDetail.value = data
        const extra = functionEvil(data.extra)
        iframeSrc.value = extra.src
      })
    }

    return {
      menuDetail,
      iframeSrc
    }
  }
})
</script>
<style lang="stylus" scoped>

</style>
