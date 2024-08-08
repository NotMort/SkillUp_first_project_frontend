import { FC, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AuctionType } from 'models/auction'
import { BidType } from 'models/bid'
import * as API from 'api/Api'
import Layout from 'components/ui/Layout'
import BidPopup from 'components/ui/BidPopup'
import { Button } from 'react-bootstrap'

const AuctionDetail: FC = () => {
  const { id } = useParams<{ id: string }>()
  const [auction, setAuction] = useState<AuctionType | null>(null)
  const [bids, setBids] = useState<BidType[]>([])
  const [error, setError] = useState<string | null>(null)
  const [showBidPopup, setShowBidPopup] = useState(false)

  useEffect(() => {
    const fetchAuctionDetails = async () => {
      try {
        const auctionResponse = await API.fetchAuctionById(id!)
        const auctionData = auctionResponse.data
        setAuction(auctionData)

        const bidsResponse = await API.fetchAuctionBids(id!)
        const bidsData = bidsResponse.data

        console.log('Fetched Bids:', bidsData)

        if (Array.isArray(bidsData) && bidsData.length > 0) {
          const sortedBids = bidsData.sort(
            (a: BidType, b: BidType) => b.bid_amount - a.bid_amount,
          )
          setBids(sortedBids)
        }
      } catch (error) {
        setError('Failed to fetch auction details')
      }
    }

    fetchAuctionDetails()
  }, [id])

  const handleBidSuccess = async () => {
    try {
      const bidsResponse = await API.fetchAuctionBids(id!)
      const bidsData = bidsResponse.data

      console.log('Fetched Bids:', bidsData)

      if (Array.isArray(bidsData) && bidsData.length > 0) {
        const sortedBids = bidsData.sort(
          (a: BidType, b: BidType) => b.bid_amount - a.bid_amount,
        )
        setBids(sortedBids)
      }
    } catch (error) {
      setError('Failed to fetch bids')
    }
  }

  const winningBid = bids.find((bid) => bid.status === 'Winning')

  if (error) {
    return (
      <Layout>
        <div className="container mt-5">
          <div className="alert alert-danger" role="alert">
            <h4 className="alert-heading">Error</h4>
            <p>{error}</p>
          </div>
        </div>
      </Layout>
    )
  }

  if (!auction) {
    return (
      <Layout>
        <div className="container mt-5">
          <p>Loading auction details...</p>
        </div>
      </Layout>
    )
  }

  const currentPrice = winningBid ? winningBid.bid_amount : auction.start_price

  return (
    <Layout>
      <div className="container mt-5">
        <h1>{auction.title}</h1>
        <img src={auction.image} alt={auction.title} className="img-fluid" />
        <p>{auction.description}</p>
        <p>Current Price: ${currentPrice}</p>
        <Button variant="primary" onClick={() => setShowBidPopup(true)}>
          Place a Bid
        </Button>
        <BidPopup
          show={showBidPopup}
          handleClose={() => setShowBidPopup(false)}
          auctionId={auction.id}
          onBidSuccess={handleBidSuccess}
        />
        <h2>Bids</h2>
        <ul className="list-group">
          {bids.length > 0 ? (
            bids.map((bid) => (
              <li key={bid.id} className="list-group-item">
                ${bid.bid_amount}
              </li>
            ))
          ) : (
            <li className="list-group-item">No bids yet</li>
          )}
        </ul>
      </div>
    </Layout>
  )
}

export default AuctionDetail
