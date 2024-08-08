import { FC, useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { CreateUpdateAuctionFields } from 'models/auction'
import * as API from 'api/Api'
import Layout from 'components/ui/Layout'

const EditAuctionPage: FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<CreateUpdateAuctionFields>()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAuction = async () => {
      if (!id) {
        console.error('No auction ID provided')
        return
      }

      try {
        const response = await API.fetchAuctionById(id)
        const auction = response.data
        setValue('title', auction.title)
        setValue('description', auction.description)

        setValue('end_date', auction.end_date)
        setLoading(false)
      } catch (error) {
        console.error('Failed to fetch auction details', error)
      }
    }

    fetchAuction()
  }, [id, setValue])

  const onSubmit = handleSubmit(async (data) => {
    if (!id) {
      console.error('No auction ID provided')
      return
    }

    try {
      await API.updateAuction(data, id)
      navigate('/')
    } catch (error) {
      console.error('Failed to update auction', error)
    }
  })

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <Layout>
      <div className="container mt-5">
        <h1>Edit Auction</h1>
        <form onSubmit={onSubmit}>
          <div className="mb-3">
            <label htmlFor="title" className="form-label">
              Title
            </label>
            <Controller
              name="title"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                  id="title"
                />
              )}
            />
            {errors.title && (
              <div className="invalid-feedback">{errors.title.message}</div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <Controller
              name="description"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <textarea
                  {...field}
                  className={`form-control ${
                    errors.description ? 'is-invalid' : ''
                  }`}
                  id="description"
                  rows={3}
                />
              )}
            />
            {errors.description && (
              <div className="invalid-feedback">
                {errors.description.message}
              </div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="end_date" className="form-label">
              End Date
            </label>
            <Controller
              name="end_date"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <input
                  {...field}
                  type="datetime-local"
                  className={`form-control ${
                    errors.end_date ? 'is-invalid' : ''
                  }`}
                  id="end_date"
                />
              )}
            />
            {errors.end_date && (
              <div className="invalid-feedback">{errors.end_date.message}</div>
            )}
          </div>

          <button type="submit" className="btn btn-primary">
            Update Auction
          </button>
        </form>
      </div>
    </Layout>
  )
}

export default EditAuctionPage
