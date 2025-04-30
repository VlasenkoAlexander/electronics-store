export interface Coupon {
  id?: number;
  code: string;
  discount: number;
  active: boolean;
  expirationDate?: string;
}
