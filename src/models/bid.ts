export interface BidType {
  id: string
  auctionId: string
  userId: string
  bid_amount: number
  status: string
  createdAt: string
  updatedAt: string
}

export interface CreateUpdateBidFields {
  auctionId: string
  amount: number
}
