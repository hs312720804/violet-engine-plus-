// eslint-disable-next-line
import { ref } from 'vue'

export default function usePagination (options) {
  options = options || {}
  const { page = 1, pageSize = 15, total = 0 } = options
  const pagination = ref({ page, pageSize, total })
  return pagination
}
