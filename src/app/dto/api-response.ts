export class ApiError extends Error {
  status: number;
  error: any;
  constructor(message: string, status: number, error: any) {
    super(message);
    this.status = status;
    this.error = error;
  }
}

export class Success {
  status: number;
  message: string;
  constructor(message: string, status: number) {
    this.message = message;
    this.status = status;
  }
}
