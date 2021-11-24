<template>
  <div style="height:100%;">
    <iframe
      :src="iframeSrc"
      v-if="iframeSrc"
      width="100%"
      height="100%"
      frameborder="0"
    ></iframe>
  </div>
</template>
<script>
export default {
  props: {
    menuId: {
      type: Number
    }
  },
  data () {
    return {
      menuDetail: '',
      iframeSrc: ''
    }
  },
  methods: {
    fetchMenuData (id) {
      this.$service.getMenusDetail({ id }).then((data) => {
        this.menuDetail = data
        const extra = this.$constants.evil(data.extra)
        this.iframeSrc = extra.src
      })
    }
  },
  created () {
    this.fetchMenuData(this.menuId)
  }
}
</script>
<style lang="stylus" scoped>

</style>
