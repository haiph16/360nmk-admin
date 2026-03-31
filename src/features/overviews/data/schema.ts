export type Overview = {
  id: number
  title: string
  content: string
  media_id: number | null
  media?: {
    id: number
    urls?: {
      large?: string
      medium?: string
      thumbnail?: string
    }
  }
  createdAt: string
  updatedAt: string
}

export type CompanyInfo = {
  id: number
  name: string
  hotline: string
}
