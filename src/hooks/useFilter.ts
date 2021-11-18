
import { ref } from 'vue'

interface FilterParams<T> {
  genDefaultFilter: () => T
  validate: (cb: () => void) => void
  onFilterChange?: () => void
}
/* eslint-disable @typescript-eslint/ban-types */
export default function useFilter<T extends object> ({ genDefaultFilter, validate, onFilterChange }: FilterParams<T>) {
  const filter = ref(genDefaultFilter())
  const filterForm = ref(genDefaultFilter())
  validate = validate || (cb => cb())
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onFilterChange = onFilterChange || (() => { })
  const handleSearch = () => {
    validate(() => {
      filter.value = JSON.parse(JSON.stringify(filterForm.value))
    })
  }

  const handleReset = () => {
    filter.value = genDefaultFilter()
    filterForm.value = genDefaultFilter()
  }

  return {
    filter,
    filterForm,
    handleSearch,
    handleReset
  }
}
