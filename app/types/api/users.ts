export interface User {
  id: number;
  name: string;
  phone: number;
  email: string;
  address: string;
}

export type UserListResponse = User[];
