import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { listApi, listItemApi } from '../api/listApi'

// Hook to fetch all of a user's lists
export const useLists = (userId: string) => {
  return useQuery({
    queryKey: ['lists', userId],
    queryFn: () => listApi.getUserLists(userId),
    enabled: !!userId, // Only run if userId exists
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

// Hook to fetch list items
export const useListItems = (listId: string) => {
  return useQuery({
    queryKey: ['listItems', listId],
    queryFn: () => listItemApi.getListItems(listId),
    enabled: !!listId, // Only run if listId exists
  })
}

// Hook to add an item
export const useAddItem = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: listItemApi.addItem,
    onSuccess: (_, variables) => {
      // Invalidate and refetch the list
      queryClient.invalidateQueries({ queryKey: ['listItems', variables.listId] })
    },
  })
}

// Hook to remove an item
export const useRemoveItem = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: listItemApi.deleteItem,
    onSuccess: (_, variables) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['listItems', variables.listId] })
    },
  })
}
