import { BidType } from './bid'

export interface AuctionType {
  id: string
  title: string
  description: string
  image: string
  start_price: number
  end_date: string
  highestBid?: BidType
  bids: BidType[] // Added array of bids
  createdAt: string
  updatedAt: string
}

export interface CreateUpdateAuctionFields {
  title: string
  description: string
  start_price: number
  end_date: string
  user_id: string
}
