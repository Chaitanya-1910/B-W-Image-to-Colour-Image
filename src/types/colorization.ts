export type ColorizationResponse = {
  result_id: string
  status: 'completed'
  original_image_url: string
  colorized_image_url: string
  processing_time: number
  width: number
  height: number
}

export type UploadedImage = {
  file: File
  previewUrl: string
  width: number
  height: number
}
