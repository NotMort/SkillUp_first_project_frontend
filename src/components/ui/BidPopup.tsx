import { FC, useState, useEffect } from 'react'
import { Modal, Button, Form } from 'react-bootstrap'
import { CreateUpdateBidFields } from 'models/bid'
import { createBid, fetchAuctionById } from 'api/Api'
import { AuctionType } from 'models/auction'

interface BidPopupProps {
  show: boolean
  handleClose: () => void
  auctionId: string
  onBidSuccess: () => void
}

const BidPopup: FC<BidPopupProps> = ({
  show,
  handleClose,
  auctionId,
  onBidSuccess,
}) => {
  const [bidAmount, setBidAmount] = useState<number>(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentPrice, setCurrentPrice] = useState<number>(0)

  useEffect(() => {
    const fetchCurrentPrice = async () => {
      try {
        const response = await fetchAuctionById(auctionId)
        const auctionData: AuctionType = response.data
        const highestBidAmount =
          auctionData.highestBid?.bid_amount || auctionData.start_price
        setCurrentPrice(highestBidAmount)
      } catch (error) {
        console.error('Failed to fetch auction details:', error)
      }
    }

    if (show) {
      fetchCurrentPrice()
    }
  }, [show, auctionId])

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)

    if (isNaN(bidAmount) || bidAmount <= 0) {
      setError('Please enter a valid bid amount.')
      setLoading(false)
      return
    }

    if (bidAmount <= currentPrice) {
      setError(
        `Bid amount must be higher than the starting price of $${currentPrice}.`,
      )
      setLoading(false)
      return
    }

    const bidData: CreateUpdateBidFields = {
      auctionId,
      amount: bidAmount,
    }

    try {
      console.log('Sending bid data:', bidData)
      const response = await createBid(bidData)
      console.log('Bid response:', response)
      if (response.status === 201) {
        onBidSuccess()
        handleClose()
      } else {
        setError('Failed to place bid. Please try again.')
      }
    } catch (error) {
      console.error('An error occurred while placing the bid:', error)
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Place Your Bid</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formBidAmount">
            <Form.Label>Bid Amount</Form.Label>
            <Form.Control
              type="number"
              value={bidAmount}
              onChange={(e) => setBidAmount(Number(e.target.value))}
            />
          </Form.Group>
          {error && <div className="alert alert-danger mt-2">{error}</div>}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} disabled={loading}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Placing Bid...' : 'Place Bid'}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default BidPopup
