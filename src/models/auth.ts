export interface UserType {
  id: string
  first_name: string
  last_name: string
  email: string
  role?: {
    id: string
    name: string
  }
  avatar?: string
}

export interface CreateUserFields {
  first_name?: string
  last_name?: string
  email: string
  password: string
  confirm_password: string
  role_id: string
}

export interface UpdateUserFields {
  first_name?: string
  last_name?: string
  email: string
  password?: string
  confirm_password?: string
  role_id: string
}

export interface LoginUserFields {
  email: string
  password: string
}

export interface RegisterUserFields {
  first_name?: string
  last_name?: string
  email: string
  password: string
  confirm_password: string
}
