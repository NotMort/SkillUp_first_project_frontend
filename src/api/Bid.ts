import { apiRoutes } from 'constants/apiConstants'
import { BidType, CreateUpdateBidFields } from 'models/bid'
import { apiRequest } from './Api'

export const fetchBids = async (auctionId: string) =>
  apiRequest<undefined, BidType[]>(
    'get',
    `${apiRoutes.BIDS_PREFIX}?auctionId=${auctionId}`,
  )

export const createBid = async (data: CreateUpdateBidFields) =>
  apiRequest<CreateUpdateBidFields, BidType>(
    'post',
    `${apiRoutes.BIDS_PREFIX}/${data.auctionId}`,
    data,
  )

export const updateBid = async (data: CreateUpdateBidFields, id: string) =>
  apiRequest<CreateUpdateBidFields, BidType>(
    'patch',
    `${apiRoutes.BIDS_PREFIX}/${id}`,
    data,
  )
export const fetchUserBids = async () =>
  apiRequest<undefined, BidType[]>('get', `${apiRoutes.BIDS_PREFIX}/user`)
export const deleteBid = async (id: string) =>
  apiRequest<string, BidType>('delete', `${apiRoutes.BIDS_PREFIX}/${id}`)
