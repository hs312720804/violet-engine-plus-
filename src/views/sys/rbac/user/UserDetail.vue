<template>
  <PageWrapper>
    <PageContentWrapper>
      <ContentLayout :title="title" @go-back="handleGoBack">
        <template #resource-actions>
          <ResourceActions :actions="actions" @do-action="handleDoAction"></ResourceActions>
        </template>
        <c-form
          ref="formRef"
          :model="user"
          :rules="rules"
          label-width="120px"
        >
          <c-form-string
            v-model="user.loginName"
            :label="$t('loginName')"
            prop="loginName"
            :readonly="!!user.id"
            placeholder
          ></c-form-string>
          <c-form-string
            v-model="user.name"
            :label="$t('xingming')"
            prop="name"
            placeholder
          ></c-form-string>
          <c-form-string
            v-model="user.email"
            :label="$t('email')"
            prop="email"
            placeholder
          ></c-form-string>
          <c-form-string
            v-if="!user.id"
            v-model="user.password"
            :label="$t('password')"
            prop="password"
            :placeholder="$t('password')"
          ></c-form-string>
          <c-form-string
            v-model="user.phone"
            :label="$t('phone')"
            prop="phone"
            placeholder
          ></c-form-string>
          <c-form-any prop="departmentId" :label="$t('department')">
            <template #edit>
              <el-cascader
                v-model="user.departmentId"
                style="width: 400px"
                :options="allDepartments"
                :props="{
                  checkStrictly: true,
                  label: 'name',
                  value: 'id',
                  expandTrigger: 'hover'
                }"
              ></el-cascader>
            </template>
          </c-form-any>
          <c-form-boolean
            v-model="user.status"
            type="switch"
            :label="$t('available')"
            true-val="ENABLE"
            false-val="DISABLE"
            :active-text="$t('enable')"
            :inactive-text="$t('disable')"
          ></c-form-boolean>
          <c-form-string
            v-model="user.remark"
            :label="$t('remark')"
            prop="remark"
            type="textarea"
          ></c-form-string>
        </c-form>
      </ContentLayout>
    </PageContentWrapper>
  </PageWrapper>
</template>

<script lang="ts">
import { defineComponent,PropType, ref, computed } from 'vue'
import { ElForm, ElMessage } from 'element-plus'
import { CForm } from '@ccprivate/admin-toolkit-plus'
import { useI18n } from 'vue-i18n'
import { PageWrapper, PageContentWrapper, ContentLayout, ResourceActions } from '@/views/modules'
import { RBACDepartment, departmentGetListService } from '@/services/department'
import { RBACUserInfo, userUpsert } from '@/services/user'
import consts from '@/utlis/consts'
const RESOURCE = 'user'
const { CREATE, UPDATE } = consts.commonOperation

export default defineComponent({
  components: {
    PageWrapper,
    PageContentWrapper,
    ContentLayout,
    ResourceActions
  },
  // props: ['initMode', 'id', 'item'],
  props: {
    id: {
      type: Number,
      default: Infinity
    },
    initMode: {
      type: String as PropType<RBACActionMode>,
      default: ''
    },
    item: {
      type: Object as PropType<RBACUserInfo>,
      default: () => {
        return {}
      }
    }
  },
  emits: {
    'upsert-end': () => true,
    'go-back': () => true
  },
  setup (props, ctx) {
    const { t: _$t } = useI18n()
    const mode = ref(props.initMode)
    const title = computed(() => {
      return consts.modeText[mode.value] + _$t('user')
    })
    const formRef = ref<InstanceType<CForm>>()
    const user = ref(genUser(props.item))
    function genUser (preset?:RBACUserInfo) {
      return {
        loginName: '',
        name: '',
        email: '',
        password: '',
        phone: '',
        remark: '',
        departmentId: '',
        status: 'ENABLE',
        ...preset
      }
    }
    const rules = ref({
      loginName: [
        {
          required: true,
          message: _$t('pleaseEnter', [_$t('loginName')])
        }
      ],
      name: [
        {
          required: true,
          message: _$t('pleaseEnter', [_$t('xingming')])
        }
      ],
      password: [
        {
          required: true,
          message: _$t('pleaseEnter', [_$t('password')])
        },
        { min: 6, message: _$t('message.pleaseEnterString', [6]), trigger: 'blur' }
      ],
      email: [
        {
          required: true,
          message: _$t('pleaseEnter', [_$t('email')])
        },
        { type: 'email', message: _$t('message.emailIncorrect'), trigger: 'blur' }
      ]
    })

    const allDepartments = ref<Array<RBACDepartment>>([])
    function fetchAllDepartments () {
      departmentGetListService().then(result => {
        allDepartments.value = result
        if (!user.value.departmentId) {
          user.value.departmentId = result[0].id
        }
      })
    }
    fetchAllDepartments()

    const actions = computed(() => {
      const submit = {
        label: _$t('btn.submit'),
        value: `${RESOURCE}:${CREATE}`
      }
      const save = {
        label: _$t('btn.save'),
        value: `${RESOURCE}:${UPDATE}`
      }

      if (user.value.id) {
        return [save]
      } else {
        return [submit]
      }
    })
    function handleDoAction (action:string) {
      if (action === `${RESOURCE}:${UPDATE}` || action === `${RESOURCE}:${CREATE}`) {
        (formRef.value?.$refs.form as InstanceType<typeof ElForm>).validate(valid => {
          if (valid) {
            handleSave()
          } else {
            ElMessage.error(_$t('message.completeForm'))
          }
        })
      }
    }
    function handleSave () {
      const data = JSON.parse(JSON.stringify(user.value))
      delete data.departmentIds
      delete data.departmentNames
      delete data.createdTime
      delete data.updatedTime
      if (Array.isArray(data.departmentId)) {
        data.departmentId = data.departmentId.pop()
      }
      userUpsert(data, _$t('message.saveSuccess'))
        .then(() => {
          ctx.emit('upsert-end')
        })
    }

    function handleGoBack () {
      ctx.emit('go-back')
    }

    return {
      title,
      formRef,
      user,
      rules,
      actions,
      allDepartments,
      handleDoAction,
      handleGoBack
    }
  }
})
</script>

<style>
</style>
