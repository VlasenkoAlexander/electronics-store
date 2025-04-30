export interface ProfileResponse {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  middleName?: string;
  birthDate?: string;
  phone?: string;

  totalSpent: number;
  loyaltyLevel: string;
  discountPercent: number;
}
