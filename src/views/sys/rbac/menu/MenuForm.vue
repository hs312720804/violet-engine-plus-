<template>
  <div>
    <c-form
      ref="menuRef"
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
            <div slot="edit">
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
            </div>
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
              v-for="(api, key) in menu.api"
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
                    <el-button label="delete" value="delete"></el-button>
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
        <!-- v-dragging="{ list: menu.fields, item: field, group: 'fieldsTab' }" -->
        <div
          v-for="(field, key) in menu.fields"
          :key="key"
          class="filed-row"
        >
          <el-row :gutter="10">
            <el-col :span="5">
              <el-input v-model="field.label" placeholder="label"></el-input>
            </el-col>
            <el-col :span="5">
              <el-input v-model="field.prop" placeholder="prop"></el-input>
            </el-col>
            <el-col :span="5">
              <el-row v-if="field.inputType==='enum'">
                <el-col :span="18">
                  <el-select v-model="field.inputType" :placeholder="$t('pleaseSelect', [$t('type')])" clearable>
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
                    @click="handleEditOption(field)"
                  ></el-button>
                </el-col>
              </el-row>
              <el-row v-else-if="field.inputType==='date'">
                <el-col :span="18">
                  <el-select v-model="field.inputType" :placeholder="$t('pleaseSelect', [$t('type')])" clearable>
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
                    @click="handleEditDateFormat(field)"
                  ></el-button>
                </el-col>
              </el-row>
              <el-select
                v-else
                v-model="field.inputType"
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
                v-model="field.use"
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
                  <i v-if="field.primaryKey" class="el-icon-key"></i>
                </div>
                <el-button type="text" icon="el-icon-rank" :title="$t('dragSort')"></el-button>
                <el-button type="text" icon="el-icon-setting" @click="handleEditExtend(field)"></el-button>
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
        <div v-for="(extra, key) in menu.extra" :key="key" style="margin-bottom:10px;">
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
    <ExtendEdit
      ref="extendEdit"
      :row="renderx"
      :has-primary-key="hasPrimaryKey"
    >
    </ExtendEdit>
    <EnumEdit
      ref="enumEdit"
      :field="enumOptions"
    ></EnumEdit>
    <DateEdit
      ref="dateEdit"
      :field="dateFormat"
    ></DateEdit>
  </div>
</template>

<script>
import { ref, watch } from 'vue'
import ExtendEdit from './ExtendEdit.vue'
import EnumEdit from './EnumEdit.vue'
import DateEdit from './DateEdit.vue'
import routerComponents from '@/router/components'

import { ElMessageBox } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { menuGetListService } from '@/services/menu'
const initialApi = [
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
]
const initialExtra = [
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
]

export default {
  components: {
    ExtendEdit,
    EnumEdit,
    DateEdit
  },
  props: {
    value: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  setup (props, ctx) {
    // const _$t = ctx.root.$t.bind(ctx.root)
    const { t } = useI18n()
    const _$t = t
    // const service = ctx.root.$service
    let menu = ref(props.value)
    watch(() => props.value, () => {
      menu.value = props.value
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
    function verifySameName (rule, value, callback) { // 校验别名是否重名
      if (value === '') {
        callback(new Error(_$t('message.menuAlias')))
      } else {
        if (isHasSameValue(allMenus.value, rule.field, value)) {
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
        if (isHasSameValue(allMenus.value, rule.field, value)) {
          callback(new Error(_$t('message.samePath')))
        } else {
          callback()
        }
      }
    }
    function isHasSameValue (menus, field, val) {
      return menus.some(item => {
        const menuId = props.value !== null ? props.value.id : ''
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
          ElMessageBox.confirm(
            _$t('message.lossDataSlert'),
            _$t('prompt'),
            {
              confirmButtonText: _$t('btn.ok'),
              cancelButtonText: _$t('btn.cancel'),
              type: 'warning'
            }).then(() => {
            setTemplate()
          }).catch(e => {
            console.log(e)
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
            menu.value.api = JSON.parse(JSON.stringify(initialApi))
            menu.value.extra = JSON.parse(JSON.stringify(initialExtra))
            menu.value.fields = [
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
            menu.value.api = []
            menu.value.fields = []
            menu.value.extra = [{
              key: 'src',
              value: ''
            }]
            break
          default:
            menu.value.api = []
            menu.value.fields = []
            menu.value.extra = []
        }
      }
    }
    function genApi () {
      menu.value.api.push({
        key: '',
        url: '',
        method: ''
      })
    }
    function handleDeleteApi (key) {
      menu.value.api.splice(key, 1)
    }
    // 添加字段
    function handleAddFiled () {
      menu.value.fields.push({
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
      menu.value.fields.splice(key, 1)
    }
    function genExtra () {
      menu.value.extra.push({
        key: '',
        value: ''
      })
    }
    function handleDeleteExtra (key) {
      menu.value.extra.splice(key, 1)
    }
    function disabledApiKey (key) {
      if (menu.value.type === 'list') {
        return initialApi.some(item => {
          return item.key === key
        })
      }
    }
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
      hasPrimaryKey.value = menu.value.fields.some(field => {
        return field.primaryKey === 1
      })
      renderx.value = item
      // ctx.refs.extendEdit.dialogRenderVisible = true
      extendEdit.value.dialogRenderVisible = true
    }
    // Enum值编辑
    const enumOptions = ref({})
    const enumEdit = ref()
    function handleEditOption (item) {
      if (item.options === undefined) {
        // ctx.root.$set(item, 'options', [])
        item.options = []
      }
      enumOptions.value = item
      // ctx.refs.enumEdit.dialogOptionVisible = true
      // ctx.refs.enumEdit.fetchEnumList()
      enumEdit.value.dialogOptionVisible = true
      enumEdit.value.fetchEnumList()
    }
    // Date格式化编辑
    const dateFormat = ref({})
    const dateEdit = ref()

    function handleEditDateFormat (item) {
      if (item.format === undefined) {
        // ctx.root.$set(item, 'format', '')
        item.format = ''
      }
      dateFormat.value = item
      // ctx.refs.dateEdit.dialogVisible = true
      dateEdit.value.dialogVisible = true
    }
    return {
      menu,
      allMenus,
      rules,
      statusOptions,
      templateOptions,
      selectTemplate,
      genApi,
      handleDeleteApi,
      handleAddFiled,
      handleReduceFiled,
      genExtra,
      handleDeleteExtra,
      disabledApiKey,
      disabledExtraKey,
      handleEditExtend,
      renderx,
      hasPrimaryKey,
      enumOptions,
      handleEditOption,
      dateFormat,
      handleEditDateFormat,
      dateEdit,
      enumEdit,
      extendEdit
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
</style>
