import type { ListItem } from '@/types/ListItemType'
import { apiClient } from '../base'

export const listItemApi = {
  getListItems: async (listId: string): Promise<ListItem[]> => {
    const { data } = await apiClient.get<ListItem[]>(`/api/lists/${listId}/items`)
    return data
  },

  addItem: async ({ listId, name }: { listId: string; name: string }): Promise<ListItem> => {
    const { data } = await apiClient.post<ListItem>(`/api/lists/${listId}/items`, {
      name,
    })
    return data
  },

  deleteItem: async ({ listId, itemId }: { listId: string; itemId: string }) => {
    const { data } = await apiClient.delete(`/api/lists/${listId}/items/${itemId}`)
    return data
  },
}
