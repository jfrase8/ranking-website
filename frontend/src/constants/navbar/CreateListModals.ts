import CreateNumberedListModal from '@/components/modals/create-list-modals/CreateNumberedListModal'
import CreateTierListModal from '@/components/modals/create-list-modals/CreateTierListModal'
import { ListTypeEnum } from '@/types/enums/ListTypeEnum'

export const CreateListModals = {
  [ListTypeEnum.NUMBERED]: CreateNumberedListModal,
  [ListTypeEnum.TIERED]: CreateTierListModal,
}
