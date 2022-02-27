import { ref, watch, computed } from '@vue/composition-api'
// import router from '@/router'

// import { title } from '@core/utils/filter'

// Notification
import { useToast } from 'vue-toastification/composition'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import store from '@/store'

export default function useCategoriesList() {
  // Use toast
  const toast = useToast()

  const refUserListTable = ref(null)

  // Table Handlers
  const tableColumns = [
    { key: 'id', sortable: true, label: 'ID' },
    { key: 'name', sortable: true, label: 'Name' },
    { key: 'email', sortable: true, label: 'Email' },
    { key: 'role_name', sortable: true, label: 'Role' },
    { key: 'profile_photo_url', label: 'Picture' },
    { key: 'product_on_hold', label: 'On Hold' },
    { key: 'product_auto_approved', label: 'Auto Approved' },
    { key: 'product_on_hold', label: 'On Hold' },
    { key: 'is_reseller', label: 'Reseller Mode' },
    { key: 'actions', label: 'view' },
    // { key: 'actions' },
  ]// Table Handlers
  const customerTableColumns = [
    { key: 'id', sortable: true, label: 'ID' },
    { key: 'name', sortable: true, label: 'Name' },
    { key: 'email', sortable: true, label: 'Email' },
    { key: 'role_name', sortable: true, label: 'Role' },
    { key: 'profile_photo_url', label: 'Picture' },
    // { key: 'actions' },
  ]

  const type = ref('seller')
  const perPage = ref(10)
  const totalRecords = ref(0)
  const currentPage = ref(1)
  const perPageOptions = [5, 10, 25, 50, 100]
  const searchQuery = ref('')
  const sortBy = ref('id')
  const isSortDirDesc = ref(true)
  const breadCrum = ref('')
  const dataMeta = computed(() => {
    const localItemsCount = refUserListTable.value ? refUserListTable.value.localItems.length : 0
    return {
      from: perPage.value * (currentPage.value - 1) + (localItemsCount ? 1 : 0),
      to: perPage.value * (currentPage.value - 1) + localItemsCount,
      of: totalRecords.value,
    }
  })

  const refetchData = () => {
    refUserListTable.value.refresh()
  }
  const fetchRecords = (ctx, callback) => {
    store
      .dispatch('users/fetchRecords', {
        type: type.value,
        q: searchQuery.value,
        perPage: perPage.value,
        page: currentPage.value,
        sortBy: sortBy.value,
        sortDesc: isSortDirDesc.value === true ? 'desc' : 'asc',
      })
      .then(response => {
        console.log(response.data.data.users.data)
        const { users } = response.data.data
        callback(users.data)
        totalRecords.value = users.total
      })
      .catch(() => {
        toast({
          component: ToastificationContent,
          props: {
            title: 'Error fetching users list',
            icon: 'AlertTriangleIcon',
            variant: 'danger',
          },
        })
      })
  }
  watch([currentPage, perPage, searchQuery], () => {
    refetchData()
  })
  // *===============================================---*
  // *--------- UI ---------------------------------------*
  // *===============================================---*

  const resolveUserStatusVariant = status => {
    if (status === 0) return 'danger'
    if (status === 1) return 'success'
    return 'success'
  }
  const resolveUserStatusText = status => {
    if (status === 0) return 'disabled'
    if (status === 1) return 'active'
    return 'active'
  }

  return {
    fetchRecords,
    tableColumns,
    perPage,
    currentPage,
    totalRecords,
    dataMeta,
    perPageOptions,
    searchQuery,
    sortBy,
    isSortDirDesc,
    refUserListTable,

    resolveUserStatusVariant,
    resolveUserStatusText,
    refetchData,

    // Extra Filters
    breadCrum,
    type,
    customerTableColumns,
  }
}
