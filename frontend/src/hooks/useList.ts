import { listApi } from '@/api/list/listApi'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

// Hook to fetch all of a user's lists
export const useLists = () => {
  return useQuery({
    queryKey: ['lists'],
    queryFn: () => listApi.getUserLists(),
    refetchOnWindowFocus: false,
  })
}

// Hook to fetch list data
export const useListData = (listId: string) => {
  return useQuery({
    queryKey: ['listData', listId],
    queryFn: () => listApi.getListData(listId),
    enabled: !!listId, // Only run if listId exists
  })
}

// Hook to create a new list
export const useCreateList = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: listApi.createList,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['lists'] })
    },
  })
}
