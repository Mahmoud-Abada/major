export interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
}

export interface ApiError {
  message: string;
  code?: string;
  field?: string;
}
