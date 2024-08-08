import { FC, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { CreateUpdateAuctionFields } from 'models/auction'
import * as API from 'api/Api'
import { routes } from 'constants/routesConstants'
import Layout from 'components/ui/Layout'
import { observer } from 'mobx-react'
import authStore from 'stores/auth.store'

const AddAuction: FC = () => {
  const navigate = useNavigate()
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateUpdateAuctionFields>()
  const [image, setImage] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const onSubmit = handleSubmit(async (data) => {
    if (!image) {
      alert('Please upload an image.')
      return
    }

    const startPrice = parseFloat(data.start_price.toString())
    if (isNaN(startPrice)) {
      alert('Starting price must be a valid number.')
      return
    }

    if (!authStore.user) {
      alert('User is not authenticated.')
      return
    }

    const auctionData: CreateUpdateAuctionFields = {
      ...data,
      start_price: startPrice,
      end_date: new Date(data.end_date).toISOString(),
      user_id: authStore.user.id,
    }

    try {
      setLoading(true)
      console.log('Submitting auctionData:', auctionData)

      const auctionResponse = await API.createAuction(auctionData)
      if (auctionResponse.status === 201) {
        const formData = new FormData()
        formData.append('image', image)
        console.log('Image file appended to FormData:', formData.get('image'))

        const imageResponse = await API.uploadAuctionImage(
          formData,
          auctionResponse.data.id,
        )
        if (imageResponse.status === 201) {
          navigate(routes.HOME)
        } else {
          console.error('Failed to upload image', imageResponse)
          alert('Failed to upload image')
        }
      } else {
        console.error('Failed to create auction', auctionResponse)
        alert('Failed to create auction')
      }
    } catch (error) {
      console.error('An error occurred while creating the auction', error)
      alert('An error occurred while creating the auction')
    } finally {
      setLoading(false)
    }
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const todayDate = new Date().toISOString().split('T')[0]

  return (
    <Layout>
      <div
        className="container d-flex justify-content-center align-items-center"
        style={{ minHeight: '100vh' }}
      >
        <div className="row w-100">
          <div className="col-md-6">
            <div
              className="card p-4 shadow"
              style={{ backgroundColor: '#e3f2fd' }}
            >
              <h1 className="text-center mb-4">Add New Auction</h1>
              <form onSubmit={onSubmit} className="needs-validation" noValidate>
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">
                    Title
                  </label>
                  <Controller
                    name="title"
                    control={control}
                    defaultValue=""
                    rules={{ required: 'Title is required' }}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        className={`form-control ${
                          errors.title ? 'is-invalid' : ''
                        }`}
                        id="title"
                      />
                    )}
                  />
                  {errors.title && (
                    <div className="invalid-feedback">
                      {errors.title.message}
                    </div>
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
                    rules={{ required: 'Description is required' }}
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

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="start_price" className="form-label">
                      Starting Price
                    </label>
                    <Controller
                      name="start_price"
                      control={control}
                      defaultValue={0}
                      rules={{
                        required: 'Starting price is required',
                        validate: (value) =>
                          /^\d+(\.\d{1,2})?$/.test(value.toString()) ||
                          'Starting price must be a valid monetary amount (e.g., 10.00)',
                        min: {
                          value: 0.01,
                          message: 'Starting price must be greater than 0',
                        },
                      }}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="number"
                          step="0.01"
                          className={`form-control ${
                            errors.start_price ? 'is-invalid' : ''
                          }`}
                          id="start_price"
                          inputMode="decimal"
                        />
                      )}
                    />
                    {errors.start_price && (
                      <div className="invalid-feedback">
                        {errors.start_price.message}
                      </div>
                    )}
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="end_date" className="form-label">
                      End Date
                    </label>
                    <Controller
                      name="end_date"
                      control={control}
                      defaultValue=""
                      rules={{
                        required: 'End date is required',
                        validate: (value) =>
                          new Date(value) > new Date() ||
                          'End date must be in the future',
                      }}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="datetime-local"
                          className={`form-control ${
                            errors.end_date ? 'is-invalid' : ''
                          }`}
                          id="end_date"
                          min={todayDate}
                        />
                      )}
                    />
                    {errors.end_date && (
                      <div className="invalid-feedback">
                        {errors.end_date.message}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="image" className="form-label">
                    Image
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    id="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    required
                  />
                </div>

                <div className="d-grid gap-2">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? 'Submitting...' : 'Submit'}
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div className="col-md-6 d-flex flex-column align-items-center">
            <div
              className="card shadow p-4"
              style={{ backgroundColor: '#e3f2fd' }}
            >
              <h2 className="text-center">Your Image</h2>
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="img-thumbnail mt-2"
                  style={{ width: '100%', height: 'auto', maxWidth: '300px' }}
                />
              ) : (
                <p className="text-center">No image selected</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default observer(AddAuction)
