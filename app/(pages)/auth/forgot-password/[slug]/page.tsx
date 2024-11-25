'use client'

import { useAuthStore } from "@/app/stores/auth"
import axios, { AxiosError, AxiosResponse } from "axios"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChangeEvent, useCallback, useEffect, useState } from "react"
import { ToastContainer, toast } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'
import Swal from "sweetalert2"

export default function ForgotPassword({ params }: { params: { slug: string } }) {
    const [changePassword, setChangePassword] = useState<boolean>(false)
    const [recoveryForm, setRecoveryForm] = useState<{
        password: string;
        password_confirmation: string;
        password_recovery_answer: string;
    }>({
        password: '',
        password_confirmation: '',
        password_recovery_answer: '',
    })
    const [user, setUser] = useState<{
        password_recovery_question: string;
        password_recovery_answer: string;
        position: string;
    }>({
        password_recovery_question: '',
        password_recovery_answer: '',
        position: ''
    })
    const router = useRouter()
    const store = useAuthStore()

    const getUser = useCallback(async () => {
        await axios.get(`/api/users?user_id=${params.slug}`)
        .then(response => {
            const u = response.data?.user
            setUser(u)
        })
        .catch(error => {
            console.log(error)
        })
    }, [])

    useEffect(() => {
        getUser()
    }, [getUser])

    const validate = () => {
        if (recoveryForm.password_recovery_answer === user.password_recovery_answer) {
            setChangePassword(true)
        } else {
            Swal.fire('Incorrect answer')
        }
    }

    const validatePassword = () => {
        if (recoveryForm.password !== recoveryForm.password_confirmation) {
            Swal.fire('Password did not match')
        }
        else {
            handleSubmit()
        }
    }

    const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target
        setRecoveryForm({
            ...recoveryForm,
            [name]: value
        })
    }

    const handleSubmit = async () => {
        toast.promise(
            axios.patch(`/api/verify?user_id=${params.slug}`, recoveryForm),
            {
                pending: 'Updating...',
                success: {
                    render({ data }: { data: AxiosResponse }) {
                        const u = data.data?.user
                        store.getUser(u)
                        if (user.position=='admin') {
                            router.push('/admin')
                        }
                        else if (user.position=='driver') {
                            router.push('/driver/report')
                        }
                        else if (user.position=='mechanic') {
                            router.push('/mechanic/reports')
                        }
                        else if (user.position=='inventory') {
                            router.push('/inventory')
                        }
                        return 'Updated'
                    }
                },
                error: {
                    render({ data }: { data: AxiosError }) {
                        Swal.fire(data.message)
                        return 'Error'
                    }
                }
            }
        )
        
    }

    return (
        <div className="w-full min-h-screen flex justify-center items-center">
            <ToastContainer position="bottom-right" />
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
                            value={user.password_recovery_question}
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
                            value={recoveryForm.password_recovery_answer}
                            onChange={handleOnChange}

                        />
                    </div>
                    <div className={`${changePassword ? 'w-full space-y-2' : 'hidden'}`}>
                        <div className="group w-full">
                            <label htmlFor="password" className="text-xs font-bold">New Password:</label>
                            <input 
                                type="password" 
                                name="password" 
                                id="password" 
                                className="w-full p-2 rounded text-xs ring-2" 
                                value={recoveryForm.password}
                                onChange={handleOnChange}
                            />
                        </div>
                        <div className="group w-full">
                            <label htmlFor="password_confirmation" className="text-xs font-bold">Confirm Password:</label>
                            <input 
                                type="password" 
                                name="password_confirmation" 
                                id="password_confirmation" 
                                className="w-full p-2 rounded text-xs ring-2" 
                                value={recoveryForm.password_confirmation}
                                onChange={handleOnChange}
                            />
                        </div>
                    </div>
                    <div className="w-full flex justify-center items-center">
                        {
                            changePassword ? (
                                <button onClick={validatePassword} type="button" className="p-2 rounded text-white text-xs font-bold bg-indigo-400 hover:bg-indigo-600">submit</button>
                            ) : (
                                <button onClick={validate} type="button" className="p-2 rounded text-white text-xs font-bold bg-blue-400 hover:bg-blue-600">continue</button>
                            )
                        }
                    </div>
                </div>
            </section>
        </div>
    )
}