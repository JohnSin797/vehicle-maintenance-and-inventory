'use client'

import { useAuthStore } from "@/app/stores/auth"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function ForgotPassword() {
    const [changePassword, setChangePassword] = useState<boolean>(false)
    const store = useAuthStore()

    useEffect(() => {

    }, [])

    const validate = () => {
        const user = store.user
        
    }

    const handleSubmit = () => {}

    return (
        <div className="w-full min-h-screen flex justify-center items-center">
            <section className="w-full md:w-96 rounded-lg shadow-xl p-5 bg-white">
                <header className="mb-5 flex justify-start items-center gap-2">
                    <Link href={'/auth/sign-in'} className="block p-2 rounded text-white text-xs font-bold bg-blue-400 hover:bg-blue-600">back</Link>
                    <h1 className="text-xl font-bold">Forgot Password</h1>
                </header>
                <div className="w-full space-y-2">
                    <div className="group w-full">
                        <label htmlFor="password_recovery_question" className="text-xs font-bold">Password Recovery Question:</label>
                        <input 
                            type="text" 
                            name="password_recovery_question" 
                            id="password_recovery_question" 
                            className="w-full p-2 rounded text-sm ring-2 outline-none" 
                            readOnly
                        />
                    </div>
                    <div className="group w-full">
                        <label htmlFor="password_recovery_answer" className="text-xs font-bold">Password Recovery Answer:</label>
                        <input 
                            type="text" 
                            name="password_recovery_answer" 
                            id="password_recovery_answer" 
                            className="w-full p-2 rounded text-sm ring-2" 
                        />
                    </div>
                    <div className={`${changePassword ? 'w-full space-y-2' : 'hidden'}`}>
                        <div className="group w-full">
                            <label htmlFor="new_password" className="text-xs font-bold">New Password:</label>
                            <input 
                                type="text" 
                                name="new_password" 
                                id="new_password" 
                                className="w-full p-2 rounded text-xs ring-2" 
                            />
                        </div>
                        <div className="group w-full">
                            <label htmlFor="confirm_password" className="text-xs font-bold">Confirm Password:</label>
                            <input 
                                type="text" 
                                name="confirm_password" 
                                id="confirm_password" 
                                className="w-full p-2 rounded text-xs ring-2" 
                            />
                        </div>
                    </div>
                    <div className="w-full flex justify-center items-center">
                        {
                            changePassword ? (
                                <button onClick={validate} type="button" className="p-2 rounded text-white text-xs font-bold bg-blue-400 hover:bg-blue-600">continue</button>
                            ) : (
                                <button onClick={handleSubmit} type="button" className="p-2 rounded text-white text-xs font-bold bg-indigo-400 hover:bg-indigo-600">submit</button>
                            )
                        }
                    </div>
                </div>
            </section>
        </div>
    )
}