import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";


interface UserState{
    token:string;
    refreshToken:string;
    role: 'Admin' | 'User';
    setAccessToken:(token:string) =>void;
    setAuth:(token:string,refreshToken:string,role:'Admin' | 'User')=>void;
    clearAuth:()=>void;
}

export const useAuthStore= create<UserState>()(
    persist(
        (set) => ({
            token: "",
            role: "User",
            refreshToken:"",
            setAccessToken: (token: string) => set({ token }),
            setAuth:(token, refreshToken, role)=>set({token,refreshToken,role}),
            clearAuth: () => set({ token: "",refreshToken: "", role: "User" }),
        }),
        {
            name: 'auth-storage', // Unique key name in localStorage
            storage: createJSONStorage(() => localStorage),
        }
    )
);