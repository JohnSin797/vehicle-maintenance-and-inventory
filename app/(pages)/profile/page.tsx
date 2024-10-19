'use client'

import Navigation from "@/app/components/Navigation";
import { ChangeEvent, FormEvent, useState } from "react";
import Image from "next/image";
import person from "@/assets/images/person.jpg";
import { useAuthStore } from "@/app/stores/auth";
import { ToastContainer, toast } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';
import Header from "@/app/components/Header";
import axios, { AxiosResponse } from "axios";
import Swal from "sweetalert2";

interface Profile {
    first_name: string;
    middle_name: string;
    last_name: string;
    extension: string;
    position: string;
}

export default function Profile() {
    const store = useAuthStore()
    const [profile, setProfile] = useState<Profile>({
        first_name: store.user.first_name,
        middle_name: store.user.middle_name,
        last_name: store.user.last_name,
        extension: store.user.extension,
        position: store.user.position,
    })
    const [buttonDisabled, setButtonDisabled] = useState<boolean>(false)

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setButtonDisabled(true)
        toast.promise(
            axios.put(`/api/profile?user_id=${store.user.id}`, profile),
            {
                pending: 'Updating profile...',
                success: {
                    render() {
                        const user = store.user
                        store.getUser({
                            ...user,
                            first_name: profile.first_name,
                            middle_name: profile.middle_name,
                            last_name: profile.last_name,
                            extension: profile.extension,
                        })
                        return 'Profile updated'
                    }
                },
                error: {
                    render({ data }: { data: AxiosResponse }) {
                        Swal.fire({
                            title: 'Update Error',
                            text: data.data?.message,
                            icon: 'error'
                        })
                        return 'ERROR'
                    }
                }
            }
        )
    }

    const handleOnChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setProfile({
            ...profile,
            [name]: value
        })
    }

    return (
        <div>
            <Navigation />
            <ToastContainer position="bottom-right" />
            <div className="pt-32">
            <Header backTo={`/`} title="PROFILE" />
                <div className="w-full flex justify-center items-center">
                    <form onSubmit={handleSubmit} className="w-full md:w-1/2 justify-center items-center flex">
                        <div className="w-full max-w-96 space-y-4 p-5 md:px-0">
                            <div className="group w-full flex justify-center items-center bg-white p-2 rounded ring-2 focus-within:ring ring-black gap-2">
                                <label htmlFor="first_name" className="">
                                    <Image src={person} alt="person-icon" width={20} height={20} />
                                </label>
                                <input 
                                    onChange={handleOnChange} 
                                    type="text" 
                                    name="first_name" 
                                    id="first_name" 
                                    className="w-full px-2 outline-none border-l border-black" 
                                    placeholder="First name"
                                    value={profile.first_name}
                                    required
                                />
                            </div>
                            <div className="group w-full flex justify-center items-center bg-white p-2 rounded ring-2 focus-within:ring ring-black gap-2">
                                <label htmlFor="middle_name" className="">
                                    <Image src={person} alt="person-icon" width={20} height={20} />
                                </label>
                                <input 
                                    onChange={handleOnChange} 
                                    type="text" 
                                    name="middle_name" 
                                    id="middle_name" 
                                    className="w-full px-2 outline-none border-l border-black" 
                                    placeholder="Middle name"
                                    value={profile.middle_name}
                                    required
                                />
                            </div>
                            <div className="group w-full flex justify-center items-center bg-white p-2 rounded ring-2 focus-within:ring ring-black gap-2">
                                <label htmlFor="last_name" className="">
                                    <Image src={person} alt="person-icon" width={20} height={20} />
                                </label>
                                <input 
                                    onChange={handleOnChange} 
                                    type="text" 
                                    name="last_name" 
                                    id="last_name" 
                                    className="w-full px-2 outline-none border-l border-black" 
                                    placeholder="Last name"
                                    value={profile.last_name}
                                    required
                                />
                            </div>
                            <div className="group w-full flex justify-center items-center bg-white p-2 rounded ring-2 focus-within:ring ring-black gap-2">
                                <label htmlFor="extension" className="">
                                    <Image src={person} alt="person-icon" width={20} height={20} />
                                </label>
                                <input 
                                    onChange={handleOnChange} 
                                    type="text" 
                                    name="extension" 
                                    id="extension" 
                                    className="w-full px-2 outline-none border-l border-black" 
                                    placeholder="Extension"
                                    value={profile.extension}
                                />
                            </div>
                            <button type="submit" disabled={buttonDisabled} className="p-2 w-full rounded bg-yellow-600 hover:bg-yellow-500 text-white font-bold">
                                SAVE
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}