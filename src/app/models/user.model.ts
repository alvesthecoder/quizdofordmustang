
export interface User {
  id: number;
  username: string;
  name: string;
  role: 'admin' | 'user';
  createdAt: Date;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  success: boolean;
  message: string;
}

export interface UserWithCredentials extends User {
  email?: string;
  password?: string;
}

export interface RegisterRequest extends LoginRequest {
  name: string;
  email: string;
}