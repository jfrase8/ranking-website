import type { PrivacyEnum } from './enums/PrivacyEnum'

export type List = {
  id: string
  name: string
  userId: string
  description?: string
  privacy: PrivacyEnum
  createdAt: string
}
