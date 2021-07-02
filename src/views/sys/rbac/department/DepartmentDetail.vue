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
          :model="department"
          :rules="rules"
          label-width="80px"
        >
          <c-form-string
            v-model="department.name"
            :label="$t('name')"
            prop="name"
            :placeholder="$t('departmentName')"
          >
          </c-form-string>
          <c-form-any prop="parentId" :label="$t('parentDepartment')">
            <div slot="edit">
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
              >
              </el-cascader>
            </div>
          </c-form-any>
          <c-form-string
            v-model="department.remark"
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
import ResrouceActions from '../../../../components/ResourceActions.vue'
import { ref, computed } from 'vue'
import { PageWrapper, PageContentWrapper, ContentLayout } from '../../../../utlis/deps'
import { ElMessage } from 'element-plus'
import consts from '../../../../utlis/consts'
const RESOURCE = 'department'
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
      return consts.modeText[mode.value] + _$t('department')
    })

    const formRef = ref(null)
    const department = ref(genDepartment(props.item))
    function genDepartment (preset) {
      return {
        name: '',
        remark: '',
        parentId: '',
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

    const allDepartments = ref([])
    function fetchAllDepartments () {
      service.departmentGetList().then(result => {
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
      service.departmentUpsert(data, _$t('message.saveSuccess'))
        .then(() => {
          ctx.emit('upsert-end')
        })
    }
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
}
</script>

<style>

</style>
