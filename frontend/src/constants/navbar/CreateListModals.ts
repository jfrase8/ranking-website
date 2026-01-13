import CreateNumberedListModal from '@/components/numbered-list/CreateNumberedListModal'
import { ListTypeEnum } from '@/types/enums/ListTypeEnum'

export const CreateListModals = {
  [ListTypeEnum.NUMBERED]: CreateNumberedListModal,
  [ListTypeEnum.TIERED]: CreateNumberedListModal,
}
