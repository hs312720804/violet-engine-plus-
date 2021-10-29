<template>
  <PageWrapper>
    <PageContentWrapper>
      <ContentLayout :title="title" @go-back="$emit('go-back')">
        <el-form v-if="!menu.id" label-width="80px">
          <el-row :gutter="14">
            <el-col
              :xs="24"
              :sm="12"
              :md="12"
              :lg="8"
              :xl="8"
            >
              <el-form-item prop="parentId" :label="$t('btn.copy')">
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
            </el-col>
          </el-row>
        </el-form>
        <c-form
          ref="formRef"
          :model="menu"
          :rules="rules"
          label-width="80px"
        >
          <h3 class="c-title">{{ $t('basicSetup') }}</h3>
          <el-row :gutter="14">
            <el-col
              :xs="24"
              :sm="12"
              :md="12"
              :lg="8"
              :xl="8"
            >
              <c-form-string
                v-model="menu.name"
                :label="$t('name')"
                prop="name"
                :placeholder="$t('menuName')"
              >
              </c-form-string>
            </el-col>
            <el-col
              :xs="24"
              :sm="12"
              :md="12"
              :lg="8"
              :xl="8"
            >
              <c-form-string
                v-model="menu.alias"
                :label="$t('alias')"
                prop="alias"
                :placeholder="$t('menuAlias')"
              >
              </c-form-string>
            </el-col>
            <el-col
              :xs="24"
              :sm="12"
              :md="12"
              :lg="8"
              :xl="8"
            >
              <c-form-string
                v-model="menu.path"
                :label="$t('path')"
                prop="path"
                :placeholder="$t('menuPath')"
              ></c-form-string>
            </el-col>
            <el-col
              :xs="24"
              :sm="12"
              :md="12"
              :lg="8"
              :xl="8"
            >
              <c-form-string
                v-model="menu.icon"
                :label="$t('icon')"
                prop="icon"
                :placeholder="$t('placeholder.menuIcon')"
              >
              </c-form-string>
            </el-col>
            <el-col
              :xs="24"
              :sm="12"
              :md="12"
              :lg="8"
              :xl="8"
            >
              <c-form-string
                v-model="menu.sort"
                :label="$t('sort')"
                prop="sort"
                :placeholder="$t('menuSort')"
              >
              </c-form-string>
            </el-col>
            <el-col
              :xs="24"
              :sm="12"
              :md="12"
              :lg="8"
              :xl="8"
            >
              <c-form-enum
                v-model="menu.status"
                type="radio"
                :label="$t('toEnable')"
                :options="statusOptions"
              ></c-form-enum>
            </el-col>
            <el-col
              :xs="24"
              :sm="12"
              :md="12"
              :lg="8"
              :xl="8"
            >
              <c-form-any prop="parentId" :label="$t('parentMenu')">
                <template #edit>
                  <el-cascader
                    v-model="menu.parentId"
                    style="width: 100%"
                    :options="allMenus"
                    :props="{
                      checkStrictly: true,
                      label: 'name',
                      value: 'id',
                      expandTrigger: 'hover'
                    }"
                    clearable
                  >
                  </el-cascader>
                </template>
              </c-form-any>
            </el-col>
            <el-col
              :xs="24"
              :sm="12"
              :md="12"
              :lg="8"
              :xl="8"
            >
              <c-form-enum
                v-model="menu.template"
                type="radio"
                :label="$t('template')"
                :options="templateOptions"
                :placeholder="$t('placeholder.selectTemplate')"
                clearable
                @change="selectTemplate"
              ></c-form-enum>
            </el-col>
            <!-- <el-col
              :xs="24"
              :sm="12"
              :md="12"
              :lg="8"
              :xl="8"
            >
              <c-form-string
                label="数据预设"
                v-model="menu.type"
                placeholder="模板预设保存后不可修改"
                :disabled="!!menu.id"
                clearable
              ></c-form-string>
            </el-col> -->
          </el-row>
          <h3 class="c-title">{{ $t('dataSet') }}</h3>
          <!-- <c-form-any label="API" prop="api">
            <el-input
              :placeholder="`${$t('sample')}：{
                list:'/entry/staff/index',
                detail: '/entry/staff/detail'
              }`"
              v-model="menu.api"
              slot="edit"
              show-word-limit
            >
            </el-input>
            <span slot="read">{{ menu.api ? $t('yes') : $t('no') }} </span>
          </c-form-any> -->
          <el-form-item label="API">
            <el-button @click="genApi">{{ $t('addApi') }}</el-button>
            <div>
              <el-row>
                <el-col
                  v-for="(api, key) in apiArr"
                  :key="key"
                  :xs="24"
                  :sm="24"
                  :md="12"
                  :lg="12"
                  :xl="12"
                >
                  <el-row style="margin-top:10px;">
                    <el-col
                      :span="6"
                    >
                      <div style="margin-right:10px">
                        <el-input
                          v-model="api.key"
                          placeholder="Key"
                          :disabled="disabledApiKey(api.key)"
                        >
                          <template #prepend>Key</template>
                        </el-input>
                      </div>
                    </el-col>
                    <el-col
                      :span="10"
                    >
                      <div style="margin-right:10px">
                        <el-input v-model="api.url" :placeholder="$t('placeholder.apiUrl')">
                          <template #prepend>Url</template>
                        </el-input>
                      </div>
                    </el-col>
                    <el-col :span="5">
                      <el-select v-model="api.method" placeholder="method">
                        <el-option label="post" value="post"></el-option>
                        <el-option label="get" value="get"></el-option>
                        <el-option label="delete" value="delete"></el-option>
                      </el-select>
                    </el-col>
                    <el-col :span="3">
                      <div style="margin-left:10px">
                        <el-button
                          v-if="!disabledApiKey(api.key)"
                          icon="el-icon-delete"
                          type="text"
                          @click="handleDeleteApi(key)"
                        ></el-button>
                      </div>
                    </el-col>
                  </el-row>
                </el-col>
                <el-col
                  :xs="24"
                  :sm="24"
                  :md="12"
                  :lg="12"
                  :xl="12"
                >
                </el-col>
              </el-row>
            </div>
          </el-form-item>
          <!-- <c-form-any label="字段" prop="fields">
              <el-input
                type="textarea"
                placeholder="字段JSON"
                v-model="menu.fields"
                :rows="5"
                slot="edit"
                show-word-limit
              >
              </el-input>
              <span slot="read">{{ menu.fields ? '是' : '否' }} </span>
            </c-form-any> -->
          <el-form-item :label="$t('fieldSet')" position="top">
            <div class="filed-row">
              <el-button @click="handleAddFiled">{{ $t('addField') }}</el-button>
            </div>
            <!-- 1111 -->
            <!-- v-dragging="{ list: fields, item: item, group: 'fieldsTab' }" -->
            <div
              v-for="(item, key) in fields"
              :key="key"
              class="filed-row"
            >
              <el-row :gutter="10">
                <el-col :span="5">
                  <el-input v-model="item.label" placeholder="label"></el-input>
                </el-col>
                <el-col :span="5">
                  <el-input v-model="item.prop" placeholder="prop"></el-input>
                </el-col>
                <el-col :span="5">
                  <el-row v-if="item.inputType==='enum'">
                    <el-col :span="18">
                      <el-select v-model="item.inputType" :placeholder="$t('pleaseSelect', [$t('type')])" clearable>
                        <el-option
                          v-for="type in inputTypeOptions"
                          :key="type.value"
                          :label="type.label"
                          :value="type.value"
                        >
                        </el-option>
                      </el-select>
                    </el-col>
                    <el-col :span="6">
                      <el-button
                        icon="el-icon-edit"
                        type="text"
                        round
                        @click="handleEditOption(item)"
                      ></el-button>
                    </el-col>
                  </el-row>
                  <el-row v-else-if="item.inputType==='date'">
                    <el-col :span="18">
                      <el-select v-model="item.inputType" :placeholder="$t('pleaseSelect', [$t('type')])" clearable>
                        <el-option
                          v-for="type in inputTypeOptions"
                          :key="type.value"
                          :label="type.label"
                          :value="type.value"
                        >
                        </el-option>
                      </el-select>
                    </el-col>
                    <el-col :span="6">
                      <el-button
                        icon="el-icon-edit"
                        type="text"
                        round
                        @click="handleEditDateFormat(item)"
                      ></el-button>
                    </el-col>
                  </el-row>
                  <el-select
                    v-else
                    v-model="item.inputType"
                    :placeholder="$t('pleaseSelect', [$t('type')])"
                    clearable
                  >
                    <el-option
                      v-for="type in inputTypeOptions"
                      :key="type.value"
                      :label="type.label"
                      :value="type.value"
                    >
                    </el-option>
                  </el-select>
                </el-col>
                <el-col :span="5">
                  <el-select
                    v-model="item.use"
                    multiple
                    filterable
                    allow-create
                    default-first-option
                    :placeholder="$t('useSet')"
                  >
                    <el-option :label="$t('list')" :value="1"></el-option>
                    <el-option :label="$t('screening')" :value="2"></el-option>
                    <el-option :label="$t('btn.edit')" :value="3"></el-option>
                  </el-select>
                </el-col>
                <el-col :span="3">
                  <div style="display:flex">
                    <div style="width:45px;">
                      <i v-if="item.primaryKey" class="el-icon-key"></i>
                    </div>
                    <el-button type="text" icon="el-icon-rank" :title="$t('dragSort')"></el-button>
                    <el-button type="text" icon="el-icon-setting" @click="handleEditExtend(item)"></el-button>
                    <el-button type="text" icon="el-icon-delete" @click="handleReduceFiled(key)"></el-button>
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-form-item>
          <!-- <c-form-any label="扩展" prop="extra">
              <el-input
                type="textarea"
                placeholder="扩展"
                v-model="menu.extra"
                :rows="5"
                slot="edit"
                show-word-limit
              >
              </el-input>
              <span slot="read">{{ menu.extra ? '是' : '否' }} </span>
            </c-form-any> -->
          <el-form-item :label="$t('extension')">
            <el-button style="margin-bottom:10px;" @click="genExtra">{{ $t('addExtension') }}</el-button>
            <div v-for="(extra, key) in extraArr" :key="key" style="margin-bottom:10px;">
              <el-row>
                <el-col
                  :xs="10"
                  :sm="9"
                  :md="8"
                  :lg="6"
                  :xl="5"
                >
                  <div style="margin-right:10px">
                    <el-input
                      v-model="extra.key"
                      placeholder="Key"
                      :disabled="disabledExtraKey(extra.key)"
                    >
                      <template #prepend>Key</template>
                    </el-input>
                  </div>
                </el-col>
                <el-col
                  :xs="10"
                  :sm="11"
                  :md="12"
                  :lg="14"
                  :xl="15"
                >
                  <el-input v-model="extra.value" placeholder="Value">
                    <template #prepend>Value</template>
                  </el-input>
                </el-col>
                <el-col :span="4">
                  <div style="margin-left:10px">
                    <el-button
                      v-if="!disabledExtraKey(extra.key)"
                      type="text"
                      icon="el-icon-delete"
                      @click="handleDeleteExtra(key)"
                    ></el-button>
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-form-item>
        </c-form>
        <ResourceActions
          :actions="actions"
          @do-action="handleDoAction"
        >
        </ResourceActions>
      </ContentLayout>
    </PageContentWrapper>
    <EnumEdit
      ref="enumEdit"
      :field="enumOptions"
    ></EnumEdit>
    <DateEdit
      ref="dateEdit"
      :field="dateFormat"
    ></DateEdit>
    <ExtendEdit
      ref="extendEdit"
      :row="renderx"
      :has-primary-key="hasPrimaryKey"
    >
    </ExtendEdit>
  </PageWrapper>
</template>

<script>
import { PageWrapper, PageContentWrapper, ContentLayout, ResourceActions } from '@/views/modules'
import EnumEdit from './EnumEdit.vue'
import DateEdit from './DateEdit.vue'
import ExtendEdit from './ExtendEdit.vue'
import routerComponents from '@/router/components'

import { ref, computed, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import consts from '../../../../utlis/consts'

import { useI18n } from 'vue-i18n'
import { menuGetListService, menuUpsertService } from '@/services/menu'
const RESOURCE = 'menu'
const { CREATE, UPDATE } = consts.commonOperation
export default {
  components: {
    PageWrapper,
    PageContentWrapper,
    ContentLayout,
    ResourceActions,
    EnumEdit,
    DateEdit,
    ExtendEdit
  },
  props: ['initMode', 'id', 'item'],
  emits: ['go-back', 'upsert-end'],
  setup (props, { emit }) {

    const { t } = useI18n()
    const _$t = t
    // const _$t = ctx.root.$t.bind(ctx.root)
    // const service = ctx.root.$service
    const mode = ref(props.initMode)
    const title = computed(() => {
      return consts.modeText[mode.value] + _$t('menu')
    })
    const templateOptions = ref([])
    Object.keys(routerComponents).forEach(key => {
      templateOptions.value.push({
        label: key + '-' + routerComponents[key].type,
        value: key
      })
    })
    const statusOptions = ref([
      {
        label: _$t('yes'),
        value: 'ENABLE'
      },
      {
        label: _$t('no'),
        value: 'DISABLE'
      }
    ])
    const formRef = ref(null)
    const menu = ref(genMenu(props.item))
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
    const rules = ref({
      name: [
        {
          required: true,
          message: _$t('pleaseEnter', [_$t('menuName')])
        }
      ],
      alias: [
        {
          required: true,
          validator: verifySameName,
          trigger: ['change', 'blur']
        }
      ],
      parentId: [
        {
          required: true,
          message: _$t('pleaseSelect', [_$t('parentMenu')])
        }
      ],
      path: [
        {
          required: true,
          validator: verifySamePath,
          trigger: ['change', 'blur']
        }
      ]
    })

    let allMenus = ref([])
    function fetchAllMenus () {
      menuGetListService().then(result => {
        allMenus.value = result
        if (!menu.value.parentId) {
          menu.value.parentId = result[0].id
        }
      })
    }

    fetchAllMenus()
    function verifySameName (rule, value, callback) { // 校验别名是否重名
      if (value === '') {
        callback(new Error(_$t('message.menuAlias')))
      } else {
        if (isHasSameValue(allMenus, rule.field, value)) {
          callback(new Error(_$t('message.sameAlias')))
        } else {
          callback()
        }
      }
    }
    function verifySamePath (rule, value, callback) { // 校验路径是否重复
      if (value === '') {
        callback(new Error(_$t('pleaseEnter', [_$t('menuPath')])))
      } else {
        if (isHasSameValue(allMenus, rule.field, value)) {
          callback(new Error(_$t('message.samePath')))
        } else {
          callback()
        }
      }
    }
    function isHasSameValue (menus, field, val) {
      return menus.some(item => {
        const menuId = props.item !== null ? props.item.id : ''
        if (item.id !== menuId) { // 排除当前编辑的菜单
          if (item[field] === val) {
            return item[field] === val
          } else {
            if (item.children !== null && item.children.length > 0) {
              return isHasSameValue(item.children, field, val)
            }
          }
        }
      })
    }
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
    const initialApi = ref([
      {
        key: 'list',
        value: '',
        method: ''
      },
      {
        key: 'detail',
        value: '',
        method: ''
      },
      {
        key: 'delete',
        value: '',
        method: ''
      },
      {
        key: 'add',
        value: '',
        method: ''
      },
      {
        key: 'update',
        value: '',
        method: ''
      }
    ])
    let apiArr = ref([])
    function apiToArr () {
      apiArr.value = [] // 复制时重新置空，再赋值
      let api = ''
      if (menu.value.api) {
        api = evil(menu.value.api)
      } else {
        api = {}
      }
      if (Object.keys(api).length > 0) {
        Object.keys(api).forEach(item => {
          apiArr.value.push({
            key: item,
            url: api[item][0],
            method: api[item][1]
          })
        })
      } else {
        apiArr.value = []
      }
    }
    apiToArr()
    function disabledApiKey (key) {
      if (menu.value.type === 'list') {
        return initialApi.value.some(item => {
          return item.key === key
        })
      }
    }
    function genApi () {
      apiArr.value.push({
        key: '',
        url: '',
        method: ''
      })
    }
    function handleDeleteApi (key) {
      apiArr.value.splice(key, 1)
    }
    // extra处理
    // 初始化列表建议的增删查改extra，可根据项目实际进行改动
    const initialExtra = reactive([
      {
        key: 'resource', // 模块资源symbol
        value: ''
      },
      {
        key: 'actions',
        value: ''
      },
      {
        key: 'listDataMap', // 返回的列表数据映射，一般会有统一的返回格式，但可能有些多了一层的情况。如果能保证统一的返回数据格式，这个可以不要，并在baseList修改一下接数据的方式
        value: ''
      },
      {
        key: 'selectionType', // 列表的是否有多选和单选
        value: ''
      }
    ])
    let extraArr = ref([])
    function extraToArr () {
      extraArr.value = [] // 复制时重新置空，再赋值
      let extra = ''
      if (menu.value.extra) {
        extra = evil(menu.value.extra)
      } else {
        extra = {}
      }
      if (Object.keys(extra).length > 0) {
        Object.keys(extra).forEach(item => {
          extraArr.value.push({
            key: item,
            value: extra[item]
          })
        })
      }
    }
    extraToArr()
    function disabledExtraKey (key) {
      if (menu.value.type === 'list') {
        return initialExtra.some(item => {
          return item.key === key
        })
      }
      if (menu.value.type === 'iframe') {
        return key === 'src'
      }
    }
    function genExtra () {
      extraArr.value.push({
        key: '',
        value: ''
      })
    }
    function handleDeleteExtra (key) {
      extraArr.value.splice(key, 1)
    }
    // 字段Fields JSON的处理
    let fields = ref([])

    function fieldsToArr () {
      fields.value = [] // 复制时重新置空，再赋值
      if (menu.value.fields) {
        fields.value = evil(menu.value.fields)
      } else {
      // 初始化字段
        fields.value = []
        // {
        //   label: '',
        //   prop: '',
        //   width: '',
        //   inputType: '',
        //   use: [],
        //   render: ''
        // }
        // ]
      }
    }
    fieldsToArr()
    // 添加字段
    function handleAddFiled () {
      fields.value.push({
        label: '',
        primaryKey: 0,
        prop: '',
        width: '',
        inputType: '',
        use: []
      })
    }
    // 删除字段
    function handleReduceFiled (key) {
      fields.value.splice(key, 1)
    }

    // Enum值编辑
    const enumOptions = ref({})
    function handleEditOption (item) {
      if (item.options === undefined) {
        // ctx.root.$set(item, 'options', [])
        item.options = []
      }
      enumOptions.value = item
      // ctx.refs.enumEdit.dialogOptionVisible = true
      const enumEdit = ref()
      enumEdit.value.dialogOptionVisible = true
    }

    // Date格式化编辑
    const dateFormat = ref({})
    function handleEditDateFormat (item) {
      if (item.format === undefined) {
        // ctx.root.$set(item, 'format', '')
        item.format = ''
      }
      dateFormat.value = item
      // ctx.refs.dateEdit.dialogVisible = true
      const dateEdit = ref()
      dateEdit.value.dialogVisible = true
    }

    // Render值编辑
    const renderx = ref({})
    const hasPrimaryKey = ref(false)
    const extendEdit = ref()

    function handleEditExtend (item) {
      if (item.render === undefined) {
        // ctx.root.$set(item, 'render', '')
        item.render = ''
      }
      if (item.primaryKey === undefined) {
        // ctx.root.$set(item, 'primaryKey', 0)
        item.primaryKey = 0
      }
      hasPrimaryKey.value = fields.value.some(field => {
        return field.primaryKey === 1
      })
      renderx.value = item
      extendEdit.value.dialogRenderVisible = true
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
        getTempItem(allMenus, id)
      }
      let list = Object.assign({}, item)
      delete list.id
      menu.value = genMenu(list)
      apiToArr()
      extraToArr()
      fieldsToArr()
    }
    function handleSave () {
      const data = JSON.parse(JSON.stringify(menu.value))
      // api转换成对象保存
      const apiObj = {}
      apiArr.value.forEach(api => {
        if (api.url) {
          apiObj[api.key] = [api.url, api.method]
        } else {
          apiObj[api.key] = []
        }
      })
      data.api = JSON.stringify(apiObj)

      // extra转换成对象保存
      const extraObj = {}
      extraArr.value.forEach(extra => {
        extraObj[extra.key] = extra.value
      })
      data.extra = JSON.stringify(extraObj)
      // 字段保存
      // 删除切换类型后不是enum类型的值
      const trimFields = fields.value.map(item => {
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
      menuUpsertService(data, _$t('message.saveSuccess'))
        .then(() => {
          emit('upsert-end')
        })
    }

    let previousTemplate = menu.value.template // 暂存切换前的模板
    let isNew = menu.value.id === undefined // 判断是否为新建，用于开关是否提醒

    function selectTemplate (val) {
      const oldType = menu.value.type
      const changeTemplateType = val ? routerComponents[val].type : val
      if (isNew) {
        isNew = false // 新建菜单切换了一次后再切换就要提醒了。
        setTemplate()
      } else {
        if (changeTemplateType !== oldType) {
          // ctx.root.$confirm(_$t('message.lossDataSlert'), _$t('prompt'), {
          //   confirmButtonText: _$t('btn.ok'),
          //   cancelButtonText: _$t('btn.cancel'),
          //   type: 'warning'
          // }).then(() => {
          //   setTemplate()
          // }).catch(() => {
          //   menu.value.type = oldType
          //   menu.value.template = previousTemplate // 取消切换再把切换前的模板还回去
          //   ctx.root.$message({
          //     type: 'info',
          //     message: _$t('message.cancelChangeTemplate')
          //   })
          // })
          console.log('13214134===' )
          ElMessageBox.confirm(
            _$t('message.lossDataSlert'),
            _$t('prompt'),
            {
              confirmButtonText: _$t('btn.ok'),
              cancelButtonText: _$t('btn.cancel'),
              type: 'warning'
            }
          )
            .then(() => {
              setTemplate()
            })
            .catch(() => {
              menu.value.type = oldType
              menu.value.template = previousTemplate // 取消切换再把切换前的模板还回去

              ElMessage({
                type: 'info',
                message: _$t('message.cancelChangeTemplate')
              })
            })
        }
      }
      function setTemplate () {
        menu.value.type = changeTemplateType
        previousTemplate = val // 切换后，切换后的模板变成下次切换的前模板
        /**
         * 增加预设数据模板在这里加case，case的值要和routerComponents的type对应
         */
        switch (menu.value.type) {
          case 'list':
            apiArr.value = JSON.parse(JSON.stringify(initialApi.value))
            extraArr.value = JSON.parse(JSON.stringify(initialExtra))
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
            break
          case 'iframe':
            apiArr.value = []
            fields.value = []
            extraArr.value = [{
              key: 'src',
              value: ''
            }]
            break
          default:
            apiArr.value = []
            fields.value = []
            extraArr.value = []
        }
      }
    }
    function handleDoAction (action) {
      if (action === `${RESOURCE}:${UPDATE}` || action === `${RESOURCE}:${CREATE}`) {
        // formRef.value.$refs.form.validate(valid => {
        //   console.log('validvalidvalidvalid',valid)
        //   if (valid) {
        handleSave()
        //   } else {
        //     ElMessage.error(_$t('message.completeRequireForm'))
        //   }
        // })
      }
    }
    function handleGoBack () {
      emit('go-back')
    }

    return {
      title,
      formRef,
      fields,
      menu,
      templateOptions,
      statusOptions,
      allMenus,
      rules,
      actions,
      apiArr,
      genApi,
      handleDeleteApi,
      disabledApiKey,
      extraArr,
      genExtra,
      handleDeleteExtra,
      disabledExtraKey,
      handleDoAction,
      handleGoBack,
      handleAddFiled,
      handleReduceFiled,
      enumOptions,
      handleEditOption,
      dateFormat,
      handleEditDateFormat,
      renderx,
      hasPrimaryKey,
      handleEditExtend,
      selectTemplate,
      copyToCreateMenu,
      extendEdit,
      handleSave
    }
  },
  data () {
    return {
      inputTypeOptions: [
        {
          value: 'string',
          label: 'string'
        },
        {
          value: 'number',
          label: 'number'
        },
        {
          value: 'image',
          label: 'image'
        },
        {
          value: 'date',
          label: 'date'
        },
        {
          value: 'enum',
          label: 'enum'
        },
        {
          value: 'operate',
          label: 'operate'
        }
      ]
    }
  },
  methods: {
    // handleDoAction (action) {
    //   debugger
    //   if (action === `${RESOURCE}:${UPDATE}` || action === `${RESOURCE}:${CREATE}`) {
    //     // this.formRef.$refs.form.validate(valid => {
    //     //   if (valid) {
    //     handleSave()
    //     // } else {
    //     //   ElMessage.error(_$t('message.completeRequireForm'))
    //     // }
    //     // })

    //     // this.$refs['formRef'].$refs.form.validate(valid => {
    //     //   if (valid) {
    //     //     alert('submit!')
    //     //   } else {
    //     //     console.log('error submit!!')
    //     //     return false
    //     //   }
    //     // })
    //   }
    // }
  }
}
</script>

<style lang="stylus" scoped>
.filed-row
  margin-bottom 10px
  .el-select
    width 100%
.use-checkbox
  padding 5px 0
  display flex
  span
    margin-right 10px
>>>.el-select
  width 100%
.c-title
  font-size 16px
  font-weight normal
  border-left 3px solid #fc4c02
  padding-left 10px
  margin-top 10px
  margin-bottom 20px
</style>>
