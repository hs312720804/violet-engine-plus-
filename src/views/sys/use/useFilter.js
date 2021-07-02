// eslint-disable-next-line
import { ref } from 'vue'

export default function useFilter ({ genDefaultFilter, validate, onFilterChange }) {
  const filter = ref(genDefaultFilter())
  const filterForm = ref(genDefaultFilter())
  validate = validate || (cb => cb())
  onFilterChange = onFilterChange || (() => {})
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
