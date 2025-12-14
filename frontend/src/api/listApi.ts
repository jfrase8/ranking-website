import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const listApi = {
  getListItems: async (listId: string) => {
    const { data } = await apiClient.get(`/api/lists/${listId}`)
    console.log('data', data)
    return data
  },

  addItem: async ({
    listId,
    itemName,
  }: {
    listId: string
    itemName: string
  }) => {
    const { data } = await apiClient.post('/api/lists/add', {
      listId,
      itemName,
    })
    return data
  },

  removeItem: async ({
    listId,
    itemId,
  }: {
    listId: string
    itemId: string
  }) => {
    const { data } = await apiClient.delete('/api/lists/remove', {
      data: { listId, itemId },
    })
    return data
  },
}
