export type Media = {
  id: number
  mime_type: string
  file_size: number
  urls: {
    original: string
    large?: string
    medium?: string
    thumbnail?: string
  }
}

export type ManagementContent = {
  id: number
  name: string
  position?: number
  media_id: number | null
  media?: Media
  createdAt?: string
  updatedAt?: string
}
