import { useForm } from 'react-hook-form'
import { CreateUpdateAuctionFields } from 'models/auction'

export const useCreateUpdateAuction = () => {
  return useForm<CreateUpdateAuctionFields>()
}
