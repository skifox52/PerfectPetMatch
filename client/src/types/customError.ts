export interface CustomErrorObject {
  data: {
    err: string
    stack: string
  }
  status: number
  componentStack?: string
}
