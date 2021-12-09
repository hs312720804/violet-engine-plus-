<template>
  <PageWrapper>
    <PageContentWrapper>
      <ContentLayout :title="title" @go-back="handleGoBack">
        <el-form label-width="80px" :inline="true">
          <el-form-item v-if="!menu.id" prop="parentId" :label="$t('btn.copy')">
            <div>
              <el-cascader
                style="width: 100%"
                :options="allMenus"
                :props="{
                  checkStrictly: true,
                  label: 'name',
                  value: 'id',
                  expandTrigger: 'hover'
                }"
                @change="copyToCreateMenu"
              >
              </el-cascader>
            </div>
          </el-form-item>
          <el-form-item label="预览JSON">
            <el-switch
              v-model="isJsonView"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="handleSwitchChange"
            >
            </el-switch>
          </el-form-item>
          <el-form-item>
            <el-upload
              class="upload-demo"
              action="#"
              :multiple="false"
              :show-file-list="false"
              accept=".json,.txt"
              :http-request="uploadReauery"
            >
              <el-tooltip
                class="item"
                effect="dark"
                content="请选择json/txt文件"
                placement="top"
              >
                <el-button size="mini">导入JSON</el-button>
              </el-tooltip>
            </el-upload>
          </el-form-item>
          <el-form-item v-if="menu.id">
            <el-button size="mini" style="margin-left:5px" @click="exportJSON">备份JSON</el-button>
          </el-form-item>
        </el-form>
        <!--菜单编辑-->
        <MenuForm v-if="!isJsonView" ref="formRef" :value="menu"></MenuForm>
        <!--预览JSON-->
        <div v-else style="margin-bottom:20px">
          <json-viewer
            :value="jsonData"
            :expand-depth="5"
            :copyable="false"
            expanded
            boxed
            sort
          ></json-viewer>
        </div>
        <ResourceActions
          v-if="!isJsonView"
          :actions="actions"
          @do-action="handleDoAction"
        >
        </ResourceActions>
      </ContentLayout>
    </PageContentWrapper>
  </PageWrapper>
</template>

<script>
import FileSaver from 'file-saver'
import { PageWrapper, PageContentWrapper, ContentLayout, ResourceActions } from '@/views/modules'
import MenuForm from './MenuForm.vue'
import { ref, computed, reactive, toRefs } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import consts from '../../../../utlis/consts'
const RESOURCE = 'menu'
const { CREATE, UPDATE } = consts.commonOperation

import { useI18n } from 'vue-i18n'
import { menuGetListService, menuUpsertService } from '@/services/menu'
import cUtils from '@ccprivate/utils/dist/ccUtil.cjs'

export default {
  components: {
    PageWrapper,
    PageContentWrapper,
    ContentLayout,
    ResourceActions,
    MenuForm
  },
  props: {
    initMode: {
      type: String,
      default: ''
    },
    id: {
      type: Number,
      default: 0
    },
    item: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  emits: ['go-back', 'upsert-end'],
  setup (props, { emit }) {
    // const _$t = ctx.root.$t.bind(ctx.root)
    const { t: _$t } = useI18n()
    // const service = ctx.root.$service
    const mode = ref(props.initMode)
    const title = computed(() => {
      return consts.modeText[mode.value] + _$t('menu')
    })
    const formRef = ref(null)
    const menu = ref({})
    const originMenu = ref(genMenu(props.item))
    menu.value = JSON.parse(JSON.stringify(originMenu.value))
    // menu.value.api = apiToArr()
    // menu.value.fields = fieldsToArr()
    // menu.value.extra = extraToArr()
    apiFiledsExtra(originMenu.value)
    function genMenu (preset) {
      return {
        name: '',
        alias: '',
        path: '',
        icon: '',
        api: '',
        sort: '',
        status: 'ENABLE',
        template: '',
        parentId: '',
        type: '',
        extra: '',
        fields: '',
        ...preset
      }
    }

    const allMenus = ref([])
    function fetchAllMenus () {
      menuGetListService().then(result => {
        allMenus.value = result
        if (!menu.value.parentId) {
          menu.value.parentId = result[0].id
        }
      })
    }
    fetchAllMenus()

    const actions = computed(() => {
      const submit = {
        label: _$t('btn.submit'),
        value: `${RESOURCE}:${CREATE}`
      }
      const save = {
        label: _$t('btn.save'),
        value: `${RESOURCE}:${UPDATE}`
      }

      if (menu.value.id) {
        return [save]
      } else {
        return [submit]
      }
    })

    function evil (fn) {
      var Fn = Function
      return new Fn('return ' + fn)()
    }
    // 初始化列表建议的增删查改api，可根据项目实际进行改动
    function apiFiledsExtra (origin) {
      function apiToArr () {
        let apiArr = [] // 复制时重新置空，再赋值
        let api = ''
        if (origin.api) {
          api = evil(origin.api)
        } else {
          api = {}
        }
        if (Object.keys(api).length > 0) {
          Object.keys(api).forEach(item => {
            apiArr.push({
              key: item,
              url: api[item][0],
              method: api[item][1]
            })
          })
        } else {
          apiArr = []
        }
        return apiArr
      }

      // extra处理
      // 初始化列表建议的增删查改extra，可根据项目实际进行改动
      function extraToArr () {
        let extraArr = [] // 复制时重新置空，再赋值
        let extra = {}
        if (origin.extra) {
          extra = evil(origin.extra)
        }
        if (Object.keys(extra).length > 0) {
          Object.keys(extra).forEach(item => {
            extraArr.push({
              key: item,
              value: extra[item]
            })
          })
        }
        return extraArr
      }

      // 字段Fields JSON的处理
      function fieldsToArr () {
        let fields = [] // 复制时重新置空，再赋值
        if (origin.fields) {
          fields = evil(origin.fields)
        } else {
          // 初始化字段
          fields = [
            {
              label: '',
              prop: '',
              width: '',
              inputType: '',
              use: [],
              render: ''
            }
          ]
        }
        return fields
      }
      menu.value.api = apiToArr()
      menu.value.fields = fieldsToArr()
      menu.value.extra = extraToArr()
    }

    function copyToCreateMenu (val) { // 复制已有的菜单
      const id = val[val.length - 1]
      let item = {}
      let getTempItem = (data, id) => {
        for (let i = 0; i < data.length; i++) {
          if (data[i].id === id) {
            item = data[i]
            break
          } else {
            if (data[i].children) getTempItem(data[i].children, id)
          }
        }
      }
      if (id) {
        getTempItem(allMenus.value, id)
      }
      const selectItem = ref(genMenu(item))
      delete selectItem.value.id
      menu.value = selectItem.value
      apiFiledsExtra(selectItem.value)
    }
    function editJsonFormat () {
      const data = JSON.parse(JSON.stringify(menu.value))
      // api转换成对象保存
      const apiObj = {}
      menu.value.api.forEach((api, index) => {
        if (api.url) {
          apiObj[api.key] = [api.url, api.method]
        } else {
          apiObj[api.key] = []
        }
      })
      data.api = JSON.stringify(apiObj)

      // extra转换成对象保存
      const extraObj = {}
      menu.value.extra.forEach((extra, index) => {
        extraObj[extra.key] = extra.value
      })
      data.extra = JSON.stringify(extraObj)
      // 字段保存
      // 删除切换类型后不是enum类型的值
      const trimFields = menu.value.fields.map((item, index) => {
        if (item.inputType !== 'enum') {
          if ('options' in item) {
            item.options = []
          }
        } else if (item.inputType !== 'date') {
          if ('format' in item) {
            item.format = ''
          }
        }
        if (item.primaryKey < 1) {
          delete item.primaryKey
        }
        return item
      })
      data.fields = JSON.stringify(trimFields)
      if (Array.isArray(data.parentId)) {
        data.parentId = data.parentId.pop()
      }
      if (!data.parentId) {
        data.parentId = 1
      }
      return data
    }
    function handleSave () {
      menuUpsertService(editJsonFormat(), _$t('message.saveSuccess'))
        .then(() => {
          emit('upsert-end')
        })
    }

    function handleDoAction (action) {
      if (action === `${RESOURCE}:${UPDATE}` || action === `${RESOURCE}:${CREATE}`) {
        formRef.value.$refs.menuRef.$refs.form.validate(valid => {
          if (valid) {
            handleSave()
          } else {
            ElMessage.error(_$t('message.completeRequireForm'))
          }
        })
      }
    }
    function handleGoBack () {
      emit('go-back')
    }
    // 预览JSON
    const isJsonView = ref(false)
    const jsonData = ref({})
    function handleSwitchChange () {
      jsonData.value = editJsonFormat()
    }
    // 导出JSON
    function exportJSON () {
      const now = cUtils.format.formatDate(new Date(), 'yyyyMMdd-hhmmss')
      const data = editJsonFormat()
      const blob = new Blob([JSON.stringify(data)], { type: '' })
      FileSaver.saveAs(blob, `${data.name}-${now}.json`)
    }
    function uploadReauery (file) {
      const reader = new FileReader()
      reader.readAsText(file.file)
      reader.onload = function (event) {
        let res = evil(this.result)
        if (res.id) { // 删除id
          delete res.id
        }
        if (menu.value.id) { // 如果是编辑导入，换成当前菜单id
          res['id'] = menu.value.id
        }
        menu.value = res
        apiFiledsExtra(res)
      }
    }
    return {
      title,
      formRef,
      menu,
      allMenus,
      actions,
      isJsonView,
      handleDoAction,
      handleGoBack,
      copyToCreateMenu,
      editJsonFormat,
      jsonData,
      handleSwitchChange,
      exportJSON,
      uploadReauery
    }
  },
  methods: {

  }
}
</script>

<style lang="stylus" scoped>

</style>>
