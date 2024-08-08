import { FC } from 'react'
import { Carousel, CarouselItem, Button } from 'react-bootstrap'
import AuctionCard from './AuctionCard'
import { AuctionType } from 'models/auction'
import dayjs from 'dayjs'

interface AuctionListProps {
  auctions: AuctionType[]
  navigateTo: 'details' | 'edit'
  onButtonClick?: (auction: AuctionType) => void
  buttonLabel?: string
  filterActive?: boolean // Add this prop
}

const AuctionList: FC<AuctionListProps> = ({
  auctions,
  navigateTo,
  onButtonClick,
  buttonLabel,
  filterActive = true,
}) => {
  const chunkSize = 3
  const auctionChunks: AuctionType[][] = []

  // Filter out expired auctions if filterActive is true
  const filteredAuctions = filterActive
    ? auctions.filter((auction) => dayjs(auction.end_date).isAfter(dayjs()))
    : auctions

  for (let i = 0; i < filteredAuctions.length; i += chunkSize) {
    auctionChunks.push(filteredAuctions.slice(i, i + chunkSize))
  }

  return (
    <Carousel interval={null}>
      {auctionChunks.map((chunk, index) => (
        <CarouselItem key={index}>
          <div className="d-flex justify-content-around mb-4">
            {chunk.map((auction: AuctionType) => (
              <div key={auction.id} className="p-2">
                <AuctionCard auction={auction} navigateTo={navigateTo} />
                {onButtonClick && (
                  <Button
                    variant="primary"
                    className="mt-2 w-100"
                    onClick={() => onButtonClick(auction)}
                  >
                    {buttonLabel}
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CarouselItem>
      ))}
    </Carousel>
  )
}

export default AuctionList
