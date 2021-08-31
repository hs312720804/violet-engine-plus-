import { computed, Ref, watch } from 'vue'
import { CTagNav } from '@ccprivate/admin-toolkit-plus'
import { useStore } from '@/store'

interface UserSiteInfoParams {
  tagRef: Ref<InstanceType<CTagNav> | undefined>
}
export default function useUserSiteInfo ({ tagRef }: UserSiteInfoParams) {
  const $store = useStore()
  const breadcrumb = computed(() => $store.getters.breadcrumb) // ref(false)
  const initTags = computed(() => $store.getters.tags)

  watch(() => tagRef.value?.tags, tags => {
    $store.dispatch('app/setTagNavs', tags)
  }, { deep: true })

  return {
    breadcrumb,
    initTags
  }
}
