import { ChangeEvent, FC, useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Form, ToastContainer, Toast } from 'react-bootstrap'
import { Controller } from 'react-hook-form'
import FormLabel from 'react-bootstrap/FormLabel'
import Button from 'react-bootstrap/Button'
import Avatar from 'react-avatar'
import { observer } from 'mobx-react'
import * as API from 'api/Api'
import authStore from 'stores/auth.store'
import { routes } from 'constants/routesConstants'
import { StatusCode } from 'constants/errorConstants'
import {
  useRegisterForm,
  RegisterUserFields,
} from 'hooks/react-hook-form/useRegister'

const RegisterForm: FC = () => {
  const navigate = useNavigate()
  const { handleSubmit, errors, control } = useRegisterForm()
  const [apiError, setApiError] = useState('')
  const [showError, setShowError] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [fileError, setFileError] = useState(false)

  const onSubmit = handleSubmit(async (data: RegisterUserFields) => {
    try {
      const response = await API.register(data)
      if (response.status !== 201) {
        throw new Error(response.data?.message || 'Registration failed')
      }

      const loginResponse = await API.login({
        email: data.email,
        password: data.password,
      })
      if (loginResponse.status !== 200) {
        throw new Error(loginResponse.data?.message || 'Login failed')
      }

      const user = loginResponse.data
      authStore.login(user)

      if (file) {
        const formData = new FormData()
        formData.append('avatar', file, file.name)
        const fileResponse = await API.uploadAvatar(formData, user.id)
        if (fileResponse.status !== 201) {
          throw new Error(fileResponse.data?.message || 'File upload failed')
        }
      }

      navigate(routes.HOME)
    } catch (error: any) {
      setApiError(error.message)
      setShowError(true)
    }
  })

  const handleFileError = () => {
    if (!file) setFileError(true)
    else setFileError(false)
  }

  const handleFileChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    if (target.files) {
      const myfile = target.files[0]
      setFile(myfile)
    }
  }

  useEffect(() => {
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
        setFileError(false)
      }
      reader.readAsDataURL(file)
    } else {
      setPreview(null)
    }
  }, [file])

  return (
    <>
      <Form className="register-form" onSubmit={onSubmit}>
        <Form.Group className="d-flex flex-column justify-content-center align-items-center">
          <FormLabel htmlFor="avatar" id="avatar-p">
            <Avatar round src={preview as string} alt="Avatar" />
          </FormLabel>
          <input
            onChange={handleFileChange}
            id="avatar"
            name="avatar"
            type="file"
            aria-label="Avatar"
            aria-describedby="avatar"
            className="d-none"
          />
          {fileError && (
            <div className="d-block invalid-feedback text-danger mb-2 text-center">
              Field avatar is required
            </div>
          )}
        </Form.Group>
        <Controller
          control={control}
          name="first_name"
          render={({ field }) => (
            <Form.Group className="mb-3">
              <FormLabel htmlFor="first_name">First name</FormLabel>
              <input
                {...field}
                type="text"
                aria-label="First name"
                aria-describedby="first_name"
                className={
                  errors.first_name ? 'form-control is-invalid' : 'form-control'
                }
              />
              {errors.first_name && (
                <div className="invalid-feedback text-danger">
                  {errors.first_name.message}
                </div>
              )}
            </Form.Group>
          )}
        />
        <Controller
          control={control}
          name="last_name"
          render={({ field }) => (
            <Form.Group className="mb-3">
              <FormLabel htmlFor="last_name">Last name</FormLabel>
              <input
                {...field}
                type="text"
                aria-label="Last name"
                aria-describedby="last_name"
                className={
                  errors.last_name ? 'form-control is-invalid' : 'form-control'
                }
              />
              {errors.last_name && (
                <div className="invalid-feedback text-danger">
                  {errors.last_name.message}
                </div>
              )}
            </Form.Group>
          )}
        />
        <Controller
          control={control}
          name="email"
          render={({ field }) => (
            <Form.Group className="mb-3">
              <FormLabel htmlFor="email">Email</FormLabel>
              <input
                {...field}
                type="email"
                placeholder="example@gmail.com"
                aria-label="Email"
                aria-describedby="email"
                className={
                  errors.email ? 'form-control is-invalid' : 'form-control'
                }
              />
              {errors.email && (
                <div className="invalid-feedback text-danger">
                  {errors.email.message}
                </div>
              )}
            </Form.Group>
          )}
        />
        <Controller
          control={control}
          name="password"
          render={({ field }) => (
            <Form.Group className="mb-3">
              <FormLabel htmlFor="password">Password</FormLabel>
              <input
                {...field}
                type="password"
                placeholder="******"
                aria-label="Password"
                aria-describedby="password"
                className={
                  errors.password ? 'form-control is-invalid' : 'form-control'
                }
              />
              {errors.password && (
                <div className="invalid-feedback text-danger">
                  {errors.password.message}
                </div>
              )}
            </Form.Group>
          )}
        />
        <Controller
          control={control}
          name="confirm_password"
          render={({ field }) => (
            <Form.Group className="mb-3">
              <FormLabel htmlFor="confirm_password">Confirm password</FormLabel>
              <input
                {...field}
                type="password"
                aria-label="Confirm password"
                aria-describedby="confirm_password"
                className={
                  errors.confirm_password
                    ? 'form-control is-invalid'
                    : 'form-control'
                }
              />
              {errors.confirm_password && (
                <div className="invalid-feedback text-danger">
                  {errors.confirm_password.message}
                </div>
              )}
            </Form.Group>
          )}
        />
        <div className="d-flex justify-content-between align-items-center mb-2">
          <p className="mb-0">Already have an account?</p>
          <Link className="text-decoration-none text-end" to={routes.LOGIN}>
            Login
          </Link>
        </div>
        <Button className="w-100" type="submit" onMouseUp={handleFileError}>
          Create account
        </Button>
      </Form>
      {showError && (
        <ToastContainer className="p-3" position="top-end">
          <Toast onClose={() => setShowError(false)} show={showError}>
            <Toast.Header>
              <strong className="me-suto text-danger">Error</strong>
            </Toast.Header>
            <Toast.Body className="text-danger bg-light">{apiError}</Toast.Body>
          </Toast>
        </ToastContainer>
      )}
    </>
  )
}

export default observer(RegisterForm)
