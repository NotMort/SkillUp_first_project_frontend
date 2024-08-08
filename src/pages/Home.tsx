import { FC, useEffect, useState } from 'react'
import { AuctionType } from 'models/auction'
import * as API from 'api/Api'
import Layout from 'components/ui/Layout'
import AuctionList from 'components/auction/AuctionList'
import BidPopup from 'components/ui/BidPopup'
import authStore from 'stores/auth.store'
import { observer } from 'mobx-react'
import { Spinner, Alert, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { routes } from 'constants/routesConstants'

const Home: FC = () => {
  const navigate = useNavigate()
  const [auctions, setAuctions] = useState<AuctionType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showBidPopup, setShowBidPopup] = useState(false)
  const [selectedAuction, setSelectedAuction] = useState<AuctionType | null>(
    null,
  )

  useEffect(() => {
    if (!authStore.isLoggedIn()) {
      setLoading(false)
      return
    }

    const fetchAuctions = async () => {
      try {
        const response = await API.fetchAuctions(1)
        if (response.data && response.data.data) {
          setAuctions(response.data.data)
        } else {
          throw new Error('Unexpected response format')
        }
      } catch (error) {
        console.error('Failed to fetch auctions', error)
        setError('Failed to fetch auctions. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchAuctions()
  }, [])

  const handleBid = (auction: AuctionType) => {
    if (!authStore.isLoggedIn()) {
      alert('You must be logged in to place a bid.')
      return
    }
    setSelectedAuction(auction)
    setShowBidPopup(true)
  }

  return (
    <Layout>
      <div className="container mt-5">
        {authStore.isLoggedIn() ? (
          <>
            <h2 className="mb-4">Auctions</h2>
            {loading ? (
              <div className="d-flex justify-content-center">
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </div>
            ) : error ? (
              <Alert variant="danger" className="text-center">
                {error}
              </Alert>
            ) : (
              <AuctionList
                auctions={auctions}
                navigateTo="details"
                onButtonClick={handleBid}
                buttonLabel="Bid"
              />
            )}
            <BidPopup
              show={showBidPopup}
              handleClose={() => setShowBidPopup(false)}
              auctionId={selectedAuction?.id || ''}
              onBidSuccess={() => {
                setShowBidPopup(false)
                setSelectedAuction(null)
              }}
            />
          </>
        ) : (
          <div className="text-center">
            <h2>Welcome to Our Auction Site</h2>
            <p>
              Discover a wide range of items up for auction, from antiques to
              modern gadgets. Our platform allows users to place bids on their
              favorite items and compete to win them.
            </p>
            <p>
              To participate in the auctions and place your bids, please{' '}
              <Button onClick={() => navigate(routes.LOGIN)}>log in</Button>.
            </p>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default observer(Home)
