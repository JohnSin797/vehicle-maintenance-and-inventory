import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface userDataState {
    id: string,
    first_name: string,
    middle_name: string,
    last_name: string,
    extension: string,
    email: string
    role: string,
    position: string,
    password_recovery_question: string,
    password_recovery_answer: string,
}

interface AuthState {
    user: userDataState,
    getUser: (userData: userDataState) => void,
    removeUser: () => void,
}

export const useAuthStore = create<AuthState>()(
    devtools(
        persist(
            (set) => ({
                user: {
                    id: '',
                    first_name: '',
                    middle_name: '',
                    last_name: '',
                    extension: '',
                    email: '',
                    role: '',
                    position: '',
                    password_recovery_question: '',
                    password_recovery_answer: ''
                },
                getUser: (userData) => set(()=>({ user: userData })),
                removeUser: () => set(()=>({ user: {
                    id: '',
                    first_name: '',
                    middle_name: '',
                    last_name: '',
                    extension: '',
                    email: '',
                    role: '',
                    position: '',
                    password_recovery_question: '',
                    password_recovery_answer: '',
                } }))
            }),
            {
                name: 'auth-storage'
            }
        )
    )
)