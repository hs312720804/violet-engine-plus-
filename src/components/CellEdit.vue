<template>
  <div class="cell-content">
    <div class="cell-main-content" style="width: 90%">
      <el-input
        v-if="!readonly"
        ref="input"
        v-model="value"
        class="edit-input"
        @focus="handleFocus"
        @blur="handleBlur"
      ></el-input>
      <div v-else class="input-place">{{ initValue }}</div>
    </div>
    <i class="el-icon-edit icon" style="cursor: pointer;" @click="handleEdit"></i>
  </div>
</template>

<script>
export default {
  name: 'CCellEdit',
  components: {},
  props: ['initValue'],
  data () {
    return {
      value: '',
      readonly: true
    }
  },
  computed: {},
  watch: {
    'initValue': 'handle'
  },
  created () {
    this.value = this.initValue
  },
  methods: {
    handle (val) {
      this.value = val
    },
    handleInput (val) {
      this.value = val
      this.$emit('input', val)
    },
    handleEdit () {
      this.readonly = false
    },
    handleBlur () {
      this.readonly = true
      this.$emit('blur', this.value)
    },
    handleFocus (e) {
      e.target.select()
    }
  }
}
</script>

<style lang="stylus" scoped>
.cell-content
  display flex
  flex-direction row
  align-items center
  justify-content space-between
  color #606266
.icon
  visibility hidden
.cell-content:hover .icon
  visibility visible
.input-place
  white-space nowrap
  overflow hidden
  text-overflow ellipsis
</style>
