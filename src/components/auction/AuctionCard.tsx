import { FC, useEffect } from 'react'
import { AuctionType } from 'models/auction'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router-dom'
import { BidType } from 'models/bid'

interface AuctionCardProps {
  auction: AuctionType
  navigateTo: 'details' | 'edit'
}

const AuctionCard: FC<AuctionCardProps> = ({ auction, navigateTo }) => {
  const navigate = useNavigate()

  // Log auction object for debugging
  useEffect(() => {
    console.log('Auction data:', auction)
  }, [auction])

  const handleCardClick = () => {
    if (navigateTo === 'details') {
      navigate(`/auction/${auction.id}`)
    } else if (navigateTo === 'edit') {
      navigate(`/edit-auction/${auction.id}`)
    }
  }

  // Determine the highest bid amount
  const highestBid = auction.bids?.reduce(
    (maxBid: BidType | null, currentBid: BidType) => {
      return maxBid === null || currentBid.bid_amount > maxBid.bid_amount
        ? currentBid
        : maxBid
    },
    null,
  )

  // Determine the current price: either the highest bid amount or the starting price
  const currentPrice = highestBid ? highestBid.bid_amount : auction.start_price

  return (
    <div className="card" style={{ width: '18rem' }} onClick={handleCardClick}>
      <img
        src={auction.image}
        className="card-img-top"
        alt={auction.title}
        style={{ height: '200px', objectFit: 'cover' }}
      />
      <div className="card-body">
        <h5 className="card-title">{auction.title}</h5>
        <p className="card-text">Current Price: ${currentPrice}</p>
        <p className="card-text">
          Ends on: {dayjs(auction.end_date).format('YYYY-MM-DD HH:mm')}
        </p>
      </div>
    </div>
  )
}

export default AuctionCard
