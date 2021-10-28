<template>
  <PageWrapper>
    <PageContentWrapper>
      <ContentLayout :title="title" @go-back="handleGoBack">
        <ResrouceActions
          slot="resource-actions"
          :actions="actions"
          @do-action="handleDoAction"
        >
        </ResrouceActions>
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
            placeholder=""
          >
          </c-form-string>
          <c-form-string
            v-model="user.name"
            :label="$t('xingming')"
            prop="name"
            placeholder=""
          >
          </c-form-string>
          <c-form-string
            v-model="user.email"
            :label="$t('email')"
            prop="email"
            placeholder=""
          >
          </c-form-string>
          <c-form-string
            v-if="!user.id"
            v-model="user.password"
            :label="$t('password')"
            prop="password"
            :placeholder="$t('password')"
          >
          </c-form-string>
          <c-form-string
            v-model="user.phone"
            :label="$t('phone')"
            prop="phone"
            placeholder=""
          >
          </c-form-string>
          <c-form-any prop="departmentId" :label="$t('department')">
            <div slot="edit">
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
              >
              </el-cascader>
            </div>
          </c-form-any>
          <c-form-boolean
            v-model="user.status"
            type="switch"
            :label="$t('available')"
            true-val="ENABLE"
            false-val="DISABLE"
            :active-text="$t('enable')"
            :inactive-text="$t('disable')"
          >
          </c-form-boolean>
          <c-form-string
            v-model="user.remark"
            :label="$t('remark')"
            prop="remark"
            type="textarea"
          >
          </c-form-string>
        </c-form>
      </ContentLayout>
    </PageContentWrapper>
  </PageWrapper>
</template>

<script>
import ResrouceActions from '../../../modules/ResourceActions.vue'
import { ref, computed } from 'vue'
import { PageWrapper, PageContentWrapper, ContentLayout } from '../../../../utlis/deps'
import consts from '../../../../utlis/consts'
import { ElMessage } from 'element-plus'
const RESOURCE = 'user'
const { CREATE, UPDATE } = consts.commonOperation

export default {
  components: {
    PageWrapper,
    PageContentWrapper,
    ContentLayout,
    ResrouceActions
  },
  props: ['initMode', 'id', 'item'],
  setup (props, ctx) {
    const _$t = ctx.root.$t.bind(ctx.root)
    const service = ctx.root.$service
    const mode = ref(props.initMode)
    const title = computed(() => {
      return consts.modeText[mode.value] + _$t('user')
    })
    const formRef = ref(null)
    const user = ref(genUser(props.item))
    function genUser (preset) {
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

    const allDepartments = ref([])
    function fetchAllDepartments () {
      service.departmentGetListService().then(result => {
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
    function handleDoAction (action) {
      if (action === `${RESOURCE}:${UPDATE}` || action === `${RESOURCE}:${CREATE}`) {
        formRef.value.$refs.form.validate(valid => {
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
      service.userUpsert(data, _$t('message.saveSuccess'))
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
}
</script>

<style>

</style>
