import { apiRoutes } from 'constants/apiConstants'
import { AuctionType, CreateUpdateAuctionFields } from 'models/auction'
import { apiRequest } from './Api'
import { Axios } from 'axios'
import { BidType } from 'models/bid'

export const fetchAuctions = async (pageNumber: number) =>
  apiRequest<undefined, AuctionType[]>(
    'get',
    `${apiRoutes.AUCTIONS_PREFIX}?page=${pageNumber}`,
  )

export const createAuction = async (data: CreateUpdateAuctionFields) =>
  apiRequest<CreateUpdateAuctionFields, AuctionType>(
    'post',
    apiRoutes.AUCTIONS_PREFIX,
    data,
  )

export const uploadAuctionImage = async (formData: FormData, id: string) =>
  apiRequest<FormData, void>(
    'post',
    `${apiRoutes.UPLOAD_AUCTION_IMAGE}/${id}`,
    formData,
  )

export const updateAuction = async (
  data: CreateUpdateAuctionFields,
  id: string,
) =>
  apiRequest<CreateUpdateAuctionFields, AuctionType>(
    'patch',
    `${apiRoutes.AUCTIONS_PREFIX}/${id}`,
    data,
  )

export const deleteAuction = async (id: string) =>
  apiRequest<string, AuctionType>(
    'delete',
    `${apiRoutes.AUCTIONS_PREFIX}/${id}`,
  )

export const fetchAddedAuctions = async (userId: string) =>
  apiRequest<undefined, AuctionType[]>(
    'get',
    `${apiRoutes.AUCTIONS_ADDED}/${userId}`,
  )

export const fetchViewedAuctions = async (userId: string) =>
  apiRequest<undefined, AuctionType[]>(
    'get',
    `${apiRoutes.AUCTIONS_VIEW}/${userId}`,
  )

export const fetchWinningAuctions = async (userId: string) =>
  apiRequest<undefined, AuctionType[]>(
    'get',
    `${apiRoutes.AUCTIONS_WINNING}/${userId}`,
  )

export const fetchEndingSoonAuctions = async () =>
  apiRequest<undefined, AuctionType[]>('get', '/auctions/ending-soon')

export const fetchRecentAuctions = async () =>
  apiRequest<undefined, AuctionType[]>('get', apiRoutes.AUCTIONS_RECENT)

export const fetchBiddedAuctions = async (userId: string) =>
  apiRequest<undefined, AuctionType[]>(
    'get',
    `${apiRoutes.AUCTIONS_BIDDED}/${userId}`,
  )
export const fetchAuctionById = async (auctionId: string) =>
  apiRequest<undefined, AuctionType[]>(
    'get',
    `${apiRoutes.AUCTIONS_PREFIX}/auction/${auctionId}`,
  )

export const fetchAuctionBids = async (auctionId: string) =>
  apiRequest<undefined, BidType[]>(
    'get',
    `${apiRoutes.BIDS_PREFIX}/${auctionId}`,
  )

export const fetchAllAuctions = async () =>
  apiRequest<undefined, AuctionType[]>('get', '/auctions')
