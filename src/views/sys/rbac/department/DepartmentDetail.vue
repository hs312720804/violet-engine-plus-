<template>
  <PageWrapper>
    <PageContentWrapper>
      <ContentLayout :title="title" @go-back="handleGoBack">
        <template #resource-actions>
          <ResourceActions :actions="actions" @do-action="handleDoAction"></ResourceActions>
        </template>

        <c-form
          ref="formRef"
          :model="department"
          :rules="rules"
          label-width="80px"
        >
          <c-form-string
            v-model="department.name"
            :label="$t('name')"
            prop="name"
            :placeholder="$t('departmentName')"
          ></c-form-string>
          <c-form-any prop="parentId" :label="$t('parentDepartment')">
            <template #edit>
              <el-cascader
                v-model="department.parentId"
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
          <c-form-string
            v-model="department.remark"
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
import { defineComponent, ref, computed, PropType } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElForm, ElMessage } from 'element-plus'
import { CForm } from '@ccprivate/admin-toolkit-plus'

import { PageWrapper, PageContentWrapper, ContentLayout, ResourceActions } from '@/views/modules'
import { RBACDepartment, departmentGetListService, departmentUpsertService } from '@/services/department'
import consts from '@/utlis/consts'

const RESOURCE = 'department'
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
      type: String as PropType<RBACMode>,
      default: ''
    },
    item: {
      type: Object as PropType<RBACDepartment>,
      default: () => {
        return {}
      }
    }
  },
  emits: ['upsert-end', 'go-back'],
  setup (props, ctx) {

    const { t: _$t } = useI18n()


    const mode = ref(props.initMode)
    const title = computed(() => {
      return consts.modeText[mode.value] + _$t('department')
    })

    const formRef = ref<InstanceType<CForm>>()
    const originDep = JSON.parse(JSON.stringify(props.item))
    const department = ref(genDepartment(props.item))
    function genDepartment (preset?: RBACDepartment) {
      return {
        name: '',
        remark: '',
        parentId: Infinity,
        ...preset
      }
    }
    const rules = ref({
      name: [
        {
          required: true,
          message: _$t('pleaseEnter', [_$t('departmentName')])
        }
      ],
      parentId: [
        {
          required: true,
          message: _$t('pleaseSelect', [_$t('parentDepartment2')])
        }
      ]
    })

    const allDepartments = ref<Array<RBACDepartment>>([])
    function fetchAllDepartments () {
      departmentGetListService().then(result => {
        allDepartments.value = result
        if (!department.value.parentId) {
          department.value.parentId = result[0].id
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

      if (department.value.id) {
        return [save]
      } else {
        return [submit]
      }
    })
    function handleSave () {
      const data = JSON.parse(JSON.stringify(department.value))
      if (Array.isArray(data.parentId)) {
        data.parentId = data.parentId.pop()
      }
      if (data.parentId === originDep.id) {
        ElMessage.error('自己不能作为自己的父级，请重新选择！')
        return
      }
      departmentUpsertService(data, _$t('message.saveSuccess'))
        .then(() => {
          ctx.emit('upsert-end')
        })
    }
    function handleDoAction (action: string) {
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
    function handleGoBack () {
      ctx.emit('go-back')
    }
    return {
      title,
      formRef,
      department,
      allDepartments,
      rules,
      actions,
      handleDoAction,
      handleGoBack
    }
  }
})
</script>

<style>
</style>
