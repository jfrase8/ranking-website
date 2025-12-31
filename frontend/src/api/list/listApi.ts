import type { List } from '@/types/ListType'
import { apiClient } from '../base'
import type { CreateListBody } from './types/body'

export const listApi = {
  getUserLists: async (userId: string): Promise<List[]> => {
    const { data } = await apiClient.get<List[]>(`/api/lists?userId=${userId}`)
    return data
  },
  getListData: async (listId: string): Promise<List> => {
    const { data } = await apiClient.get<List>(`/api/lists/${listId}`)
    return data
  },
  createList: async (list: CreateListBody): Promise<List> => {
    const { data } = await apiClient.post<List>('/api/lists', list)
    return data
  },
}
