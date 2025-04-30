import { Review } from './review.model';

export interface Product {
  id: number;
  brand: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  category?: string;
  stock: number;
  reviews?: Review[];
}