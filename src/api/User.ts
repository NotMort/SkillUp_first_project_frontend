import { apiRoutes } from 'constants/apiConstants'
import { apiRequest } from './Api'
import {
  CreateUserFields,
  LoginUserFields,
  RegisterUserFields,
  UpdateUserFields,
  UserType,
} from 'models/auth'
import { AuctionType } from 'models/auction'
import { BidType } from 'models/bid'
import { Axios } from 'axios'

export const fetchUser = async () =>
  apiRequest<undefined, UserType>('get', apiRoutes.FETCH_USER)
export const fetchUsers = async (pageNumber: number) =>
  apiRequest<number, UserType[]>(
    'get',
    `${apiRoutes.USERS_PREFIX}?page=${pageNumber}`,
  )

export const login = async (data: LoginUserFields) =>
  apiRequest<LoginUserFields, UserType>('post', apiRoutes.LOGIN, data)

export const register = async (data: RegisterUserFields) =>
  apiRequest<RegisterUserFields, void>('post', apiRoutes.SIGNUP, data)

export const signout = async () =>
  apiRequest<undefined, void>('post', apiRoutes.SIGNOUT)

export const refreshTokens = async () =>
  apiRequest<undefined, UserType>('get', apiRoutes.REFRESH_TOKENS)

export const uploadAvatar = async (formData: FormData, id: string) =>
  apiRequest<FormData, void>(
    'post',
    `${apiRoutes.UPLOAD_AVATAR_IMAGE}/${id}`,
    formData,
  )

export const createUser = async (data: CreateUserFields) =>
  apiRequest<CreateUserFields, void>('post', apiRoutes.USERS_PREFIX, data)

export const updateUser = async (data: UpdateUserFields, id: string) =>
  apiRequest<UpdateUserFields, void>(
    'patch',
    `${apiRoutes.USERS_PREFIX}/${id}`,
    data,
  )

export const deleteUser = async (id: string) =>
  apiRequest<string, UserType>('delete', `${apiRoutes.USERS_PREFIX}/${id}`)

export const fetchUserAuctions = async () =>
  apiRequest<undefined, AuctionType[]>('get', apiRoutes.USERS_MY_AUCTIONS)

export const fetchUserById = async (userId: string) =>
  apiRequest<undefined, UserType>('get', `${apiRoutes.USERS_PREFIX}/${userId}`)
