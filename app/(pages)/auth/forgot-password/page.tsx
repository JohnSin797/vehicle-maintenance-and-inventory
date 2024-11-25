'use client'

import axios from "axios"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { FormEvent, useState } from "react"
import Swal from "sweetalert2"

export default function ForgotPassword() {
    const [email, setEmail] = useState<string>('')
    const router = useRouter()

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        await axios.get(`/api/verify?email=${email}`)
        .then(response => {
            const user = response.data?.user
            router.push(`/auth/forgot-password/${user?._id}`)
        })
        .catch(error => {
            console.log(error)
            Swal.fire({
                title: 'Error',
                text: error.response?.data?.message,
                icon: 'error'
            })
        })
    }

    return (
        <div className="w-full min-h-screen flex justify-center items-center">
            <section className="w-full md:w-96 rounded-lg shadow-xl p-5 bg-white">
                <header className="mb-5 flex justify-start items-center gap-2">
                    <Link href={'/auth/sign-in'} className="block p-2 rounded text-white text-xs font-bold bg-blue-400 hover:bg-blue-600">back</Link>
                    <h1 className="text-xl font-bold">Forgot Password</h1>
                </header>
                <form onSubmit={handleSubmit}>
                    <div className="w-full space-y-2">
                        <div className="group w-full">
                            <label htmlFor="email" className="text-xs font-bold">Email:</label>
                            <input 
                                type="email" 
                                name="email" 
                                id="email" 
                                className="w-full p-2 rounded text-sm ring-2 outline-none" 
                                value={email}
                                onChange={(e)=>setEmail(e.target.value)}
                                required
                            />
                        </div>
                        
                        <div className="w-full flex justify-center items-center">
                            <button className="p-2 rounded text-white text-xs font-bold bg-indigo-400 hover:bg-indigo-600">submit</button>
                        </div>
                    </div>
                </form>
            </section>
        </div>
    )
}