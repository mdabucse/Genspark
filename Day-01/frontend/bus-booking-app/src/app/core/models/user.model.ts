export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  isActive: boolean;
  isVerified: boolean;
  createdAt: Date;
}

export interface AuthResponse {
  token: string;
  role: string;
  name: string;
  email: string;
  userId: number;
}
