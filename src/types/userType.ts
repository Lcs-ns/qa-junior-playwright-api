export type CreateUserPayload = {
    name: string
    email: string
    gender: 'male' | 'female'
    status: 'active' | 'inactive'
}