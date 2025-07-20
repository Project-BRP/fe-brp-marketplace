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
  },
  setUserData: (user) => set({ userData: user }),
  resetUserData: () =>
    set({
      userData: {
        userId: "",
        name: "",
        email: "",
        role: "",
      },
    }),
}));

export default useUserStore;
