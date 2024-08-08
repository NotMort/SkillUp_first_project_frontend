import { useForm } from 'react-hook-form'
import { CreateUpdateBidFields } from 'models/bid'

export const useCreateUpdateBid = () => {
  return useForm<CreateUpdateBidFields>()
}
