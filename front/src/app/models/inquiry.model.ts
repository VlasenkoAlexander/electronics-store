export interface Inquiry {
  id: number;
  subject: string;
  message: string;
  response?: string;
  createdAt: string;
  respondedAt?: string;
  user: {
    id: number;
    username: string;
  };
}
