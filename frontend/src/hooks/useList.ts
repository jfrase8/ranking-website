import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { listItemApi } from '../api/listApi'

// Hook to fetch list items
export const useListItems = (listId: string) => {
  return useQuery({
    queryKey: ['listItems', listId],
    queryFn: () => {
      console.log('listId', listId)
      return listItemApi.getListItems(listId)
    },
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
