export interface Course {
  courseId: string
  title: string
  description: string
  price: bigint
  creator: string
  isActive: boolean
  createdAt: bigint
}

export interface UserData {
  address: string
  name: string
  purchasedCourses: string[]
}

export interface TokenExchangeProps {
  ethAmount: string
  tokenAmount: string
}