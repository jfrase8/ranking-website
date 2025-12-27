import axios from 'axios'
import type { ListItem } from '@/pages/NumberedList'

const API_BASE_URL = import.meta.env.VITE_API_URL

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const listItemApi = {
  getListItems: async (listId: string): Promise<ListItem[]> => {
    const { data } = await apiClient.get<ListItem[]>(`/api/lists/${listId}/items`)
    console.log('data', data)
    return data
  },

  addItem: async ({
    listId,
    itemName,
  }: {
    listId: string
    itemName: string
  }): Promise<ListItem> => {
    const { data } = await apiClient.post<ListItem>(`/api/lists/${listId}/items`, {
      itemName,
    })
    return data
  },

  deleteItem: async ({ listId, itemId }: { listId: string; itemId: string }) => {
    const { data } = await apiClient.delete(`/api/lists/${listId}/items/${itemId}`)
    return data
  },
}
