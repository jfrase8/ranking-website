import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { listApi } from '../api/listApi'

// Hook to fetch list items
export const useListItems = (listId: string) => {
  return useQuery({
    queryKey: ['list', listId],
    queryFn: () => {
      console.log('listId', listId)
      listApi.getListItems(listId)
    },
    enabled: !!listId, // Only run if listId exists
  })
}

// Hook to add an item
export const useAddItem = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: listApi.addItem,
    onSuccess: (_, variables) => {
      // Invalidate and refetch the list
      queryClient.invalidateQueries({ queryKey: ['list', variables.listId] })
    },
  })
}

// Hook to remove an item
export const useRemoveItem = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: listApi.removeItem,
    onSuccess: (_, variables) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['list', variables.listId] })
    },
  })
}
