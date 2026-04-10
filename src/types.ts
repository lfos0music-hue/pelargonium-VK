import { Timestamp } from 'firebase/firestore';

export interface Product {
  id?: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  category?: string;
  inStock: boolean;
  createdAt: Timestamp;
}

export interface UserProfile {
  uid: string;
  email: string | null;
  role: 'admin' | 'user';
}
