export type Media = {
  id: number
  mime_type: string
  file_size: number
  width: number
  height: number
  urls: {
    large: string
    medium: string
    original: string
    thumbnail: string
  }
}

export type View = {
  id: number
  position?: number
  name: string
  url: string
  media_id: number | null
  media?: Media
  createdAt?: string
  updatedAt?: string
}
