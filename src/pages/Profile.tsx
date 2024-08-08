import { FC, useEffect, useState } from 'react'
import { AuctionType } from 'models/auction'
import { UserType } from 'models/auth'
import { BidType } from 'models/bid'
import * as API from 'api/Api'
import AuctionList from 'components/auction/AuctionList'
import Layout from 'components/ui/Layout'
import { ListGroup, Spinner, Alert, Image } from 'react-bootstrap'

interface BidWithDetails extends BidType {
  auction: AuctionType
  bidder: UserType
}

const Profile: FC = () => {
  const [user, setUser] = useState<UserType | null>(null)
  const [auctions, setAuctions] = useState<AuctionType[]>([])
  const [bids, setBids] = useState<BidWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await API.fetchUser()
        console.log('Fetched User:', response.data)
        if (response.data) {
          setUser(response.data)
        } else {
          throw new Error('Unexpected response format')
        }
      } catch (error) {
        console.error('Failed to fetch user details', error)
        setError('Failed to fetch user details')
      }
    }

    const fetchUserBids = async () => {
      try {
        const response = await API.fetchUserBids()
        console.log('Fetched Bids:', response.data)
        if (Array.isArray(response.data)) {
          const mappedBids = response.data.map((bid: any) => ({
            ...bid,
            amount: bid.bid_amount,
          }))
          setBids(mappedBids)
        } else {
          throw new Error('Unexpected response format')
        }
      } catch (error) {
        console.error('Failed to fetch user bids', error)
        setError('Failed to fetch user bids')
      }
    }

    const fetchUserAuctions = async () => {
      try {
        const response = await API.fetchUserAuctions()
        if (Array.isArray(response.data)) {
          setAuctions(response.data)
        } else {
          throw new Error('Unexpected response format')
        }
      } catch (error) {
        console.error('Failed to fetch user auctions', error)
        setError('Failed to fetch user auctions')
      }
    }

    const fetchData = async () => {
      setLoading(true)
      await Promise.all([
        fetchUserDetails(),
        fetchUserBids(),
        fetchUserAuctions(),
      ])
      setLoading(false)
    }

    fetchData()
  }, [])

  const handleDelete = async (auction: AuctionType) => {
    try {
      await API.deleteAuction(auction.id)
      setAuctions(auctions.filter((a) => a.id !== auction.id))
    } catch (error) {
      console.error('Failed to delete auction', error)
    }
  }

  if (loading) {
    return (
      <Layout>
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: '100vh' }}
        >
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      </Layout>
    )
  }

  if (error) {
    return (
      <Layout>
        <div className="container mt-5">
          <Alert variant="danger">
            <Alert.Heading>Error</Alert.Heading>
            <p>{error}</p>
          </Alert>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="container mt-5">
        <div className="card mb-4">
          <div className="card-body">
            <h2 className="card-title">Profile</h2>
            {user ? (
              <div>
                {user.avatar && (
                  <Image
                    src={`/users/avatar/${user.avatar}`}
                    roundedCircle
                    width={150}
                    height={150}
                  />
                )}
                <p>
                  <strong>Name:</strong> {user.first_name} {user.last_name}
                </p>
                <p>
                  <strong>Email:</strong> {user.email}
                </p>
              </div>
            ) : (
              <p>Loading profile...</p>
            )}
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-body">
            <h2 className="card-title">My Auctions</h2>
            <AuctionList
              auctions={auctions}
              onButtonClick={handleDelete}
              buttonLabel="Delete"
              navigateTo="edit"
              filterActive={false}
            />
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-body">
            <h2 className="card-title">My Bids</h2>
            <ListGroup>
              {bids.map((bid: BidWithDetails) => (
                <ListGroup.Item
                  key={bid.id}
                  style={{
                    backgroundColor:
                      bid.status === 'Winning' ? 'green' : 'white',
                  }}
                >
                  <div>
                    <strong>Auction:</strong> {bid.auction.title}
                  </div>
                  <div>
                    <strong>Bid Amount:</strong> ${bid.bid_amount}
                  </div>
                  <div>
                    <strong>Status:</strong> {bid.status}
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Profile
