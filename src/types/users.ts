export type User = {
  userId: string;
  email: string;
  name: string;
  role: string;
  phoneNumber: string;
  photoProfile?: string | null;
  isActive: boolean;
  totalTransaction: number;
  createdAt: Date;
};
