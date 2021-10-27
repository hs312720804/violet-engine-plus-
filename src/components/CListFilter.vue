<template>
  <div class="filter-form">
    <c-form :label-width="showLabel ? labelWidth : ''" @submit.prevent @keyup.enter="handleFilter">
      <template v-for="(item, key) in formItems">
        <template v-if="!item.queryExclude">
          <c-form-string
            v-if="!item.inputType || item.inputType === 'string'"
            :key="key"
            v-model="filterForm[item.prop]"
            :label="showLabel ? item.label : ''"
            :placeholder="(item.placePrefix ? item.placePrefix : '请输入') + item.label"
          ></c-form-string>
          <c-form-enum
            v-if="item.inputType === 'enum'"
            :key="key"
            v-model="filterForm[item.prop]"
            :label="showLabel ? item.label : ''"
            :prop="item.prop"
            :options="item.options"
            :placeholder="item.label"
            clearable
          ></c-form-enum>
          <c-form-any
            v-if="item.inputType === 'date'"
            :key="key"
            :prop="item.prop"
            :label="showLabel ? item.label : ''"
          >
            <template #edit>
              <el-date-picker v-model="filterForm[item.prop]" type="date" :placeholder="item.label"></el-date-picker>
            </template>
          </c-form-any>
          <slot name="loop" :data="item"></slot>
        </template>
      </template>
      <slot name="outloop"></slot>
      <div style="margin-left:0; margin-bottom:14px;">
        <el-button-group v-if="isButton">
          <el-button class="text-btn" @click="handleFilter">{{ genButtonText.query }}</el-button>
          <el-button class="text-btn" @click="handleFilterReset">{{ genButtonText.reset }}</el-button>
          <template v-if="!hiddenExpandButton">
            <el-button v-if="!expand" class="text-btn" @click="handleFilterExpand">
              {{ genButtonText.expand }}
              <i class="el-icon-arrow-down"></i>
            </el-button>
            <el-button v-if="expand" class="text-btn" @click="handleFilterExpand">
              {{ genButtonText.packUp }}
              <i class="el-icon-arrow-up"></i>
            </el-button>
          </template>
        </el-button-group>
        <template v-else>
          <el-button type="text" class="text-btn" @click="handleFilter">{{ genButtonText.query }}</el-button>
          <el-divider direction="vertical"></el-divider>
          <el-button
            type="text"
            class="text-btn"
            @click="handleFilterReset"
          >
            {{ genButtonText.reset }}
          </el-button>
          <template v-if="!hiddenExpandButton">
            <el-divider direction="vertical"></el-divider>
            <el-button
              v-if="!expand"
              type="text"
              class="text-btn"
              @click="handleFilterExpand"
            >
              {{ genButtonText.expand }}
              <i class="el-icon-arrow-down"></i>
            </el-button>
            <el-button
              v-if="expand"
              type="text"
              class="text-btn"
              @click="handleFilterExpand"
            >
              {{ genButtonText.packUp }}
              <i class="el-icon-arrow-up"></i>
            </el-button>
          </template>
        </template>
      </div>
    </c-form>
  </div>
</template>

<script lang="ts">
interface CListFilterItem {
  prop: string
  label: string
  inputType: 'string' | 'enum' | 'date'
  options: Array<COptions>
  placePrefix?: string
  queryExclude: boolean
}
interface CListFilterButton {
  'query': '查询'
  'reset': '重置'
  'expand': '展开'
  'packUp': '收起'
}
import { defineComponent, PropType, ref, reactive, computed } from 'vue'
export default defineComponent({
  components: {
  },
  props: {
    options: {
      type: Array as PropType<Array<CListFilterItem>>,
      default: () => {
        return []
      }
    },
    formData: {
      type: Object as PropType<{ [key: string]: any; }>,
      default: () => {
        return {}
      }
    },
    isExpand: {
      type: Boolean,
      default: false
    },
    length: {
      type: Number,
      default: 0
    },
    hiddenExpandButton: {
      type: Boolean
    },
    isButton: {
      type: Boolean,
      default: true
    },
    showLabel: {
      type: Boolean,
      default: false
    },
    labelWidth: {
      type: String,
      default: '80px'
    }
  },
  emits: ['filter', 'filter-expand', 'reset'],
  setup (props, { emit }) {
    const expand = ref(props.isExpand)
    const genButtonText = computed<CListFilterButton>(() => {
      return {
        query: '查询',
        reset: '重置',
        expand: '展开',
        packUp: '收起'
      }
    })
    const formItems = computed(() => {
      if (props.length) {
        return props.options.slice(0, props.length)
      } else {
        return props.options
      }
    })
    const filterForm = reactive(props.formData)
    function handleFilter () {
      emit('filter')
    }
    function handleFilterReset () {
      emit('reset')
    }
    function handleFilterExpand () {
      expand.value = !expand.value
      emit('filter-expand', expand.value)
    }
    return {
      expand,
      genButtonText,
      formItems,
      filterForm,
      handleFilter,
      handleFilterReset,
      handleFilterExpand
    }
  }
})
</script>
<style lang="stylus" scoped>
:deep(.el-form)
  display flex
  flex-wrap wrap
  flex-direction row
  .el-form-item
    min-width 220px
    margin-right 10px
    margin-bottom 14px !important
    align-self flex-start
</style>
