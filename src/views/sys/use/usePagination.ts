// eslint-disable-next-line
import { ref } from 'vue'
interface PaginationOptions { page: number; pageSize: number; total: number; }
export default function usePagination (options?: PaginationOptions) {
  options = options || {} as PaginationOptions
  const { page = 1, pageSize = 15, total = 0 } = options
  const pagination = ref({ page, pageSize, total })
  return pagination
}
