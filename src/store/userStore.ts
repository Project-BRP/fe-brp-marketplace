"use client";
import { User } from "@/types/users";
import { create } from "zustand";

interface UserState {
  userData: User;
  setUserData: (user: User) => void;
  resetUserData: () => void;
}

const useUserStore = create<UserState>((set) => ({
  userData: {
    userId: "",
    name: "",
    email: "",
    role: "",
    phoneNumber: "",
    photoProfile: "",
    isActive: false,
    totalTransaction: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  setUserData: (user) => set({ userData: user }),
  resetUserData: () =>
    set({
      userData: {
        userId: "",
        name: "",
        email: "",
        role: "",
        phoneNumber: "",
        photoProfile: "",
        isActive: false,
        totalTransaction: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    }),
}));

export default useUserStore;
