import { listApi } from '@/api/list/listApi'
import type { UpdateListBody } from '@/api/list/types/body'
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'

// Hook to fetch all of a user's lists
export const useLists = () => {
  return useSuspenseQuery({
    queryKey: ['lists'],
    queryFn: () => listApi.getUserLists(),
    refetchOnWindowFocus: false,
  })
}

// Hook to fetch list data
export const useUpdateList = (listId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (list: UpdateListBody) => listApi.updateList(listId, list),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['lists'] })
    },
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
