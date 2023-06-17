export interface CustomErrorObject {
  response: {
    data: {
      err: string
      stack: string
    }
  }
  status: number
  componentStack?: string
}
