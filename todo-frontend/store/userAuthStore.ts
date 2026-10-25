import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";


interface UserState{
    token:string;
    role: 'Admin' | 'User';
    setToken:(token:string) =>void;
    setRole:(role:'Admin' | 'User')=>void;
    clearAuth:()=>void;
}

export const useAuthStore= create<UserState>()(
    persist(
        (set) => ({
            token: "",
            role: "User",
            setToken: (token: string) => set({ token }),
            setRole: (role: 'Admin' | 'User') => set({ role }),
            clearAuth: () => set({ token: "", role: "User" }),
        }),
        {
            name: 'auth-storage', // Unique key name in localStorage
            storage: createJSONStorage(() => localStorage),
        }
    )
);