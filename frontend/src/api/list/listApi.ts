import type { List } from '@/types/ListType'
import { apiClient } from '../base'
import type { CreateListBody, UpdateListBody } from './types/body'

export const listApi = {
  getUserLists: async (): Promise<List[]> => {
    const { data } = await apiClient.get<List[]>(`/api/lists`)
    return data
  },
  createList: async (list: CreateListBody): Promise<List> => {
    const { data } = await apiClient.post<List>('/api/lists', list)
    return data
  },
  updateList: async (listId: string, list: UpdateListBody): Promise<List> => {
    const { data } = await apiClient.patch<List>(`/api/lists/${listId}`, list)
    return data
  },
}
