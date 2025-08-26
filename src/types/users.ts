export type User = {
  userId: string;
  email: string;
  name: string;
  role: string;
  phoneNumber: string;
  photoProfile?: string | null;
  totalTransaction: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};
