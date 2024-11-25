'use client'

import Navigation from "@/app/components/Navigation";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useAuthStore } from "@/app/stores/auth";
import { ToastContainer, toast } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';
import Header from "@/app/components/Header";
import axios, { AxiosResponse } from "axios";
import Swal from "sweetalert2";
import { MdEmail, MdQuestionAnswer } from "react-icons/md";
import { FaLock, FaQuestionCircle } from "react-icons/fa";
import CreatableSelect from "react-select/creatable";

type OptionType = {
    label: string;
    value: string;
}

interface Profile {
    email: string;
    password: string;
    password_confirmation: string;
    password_recovery_question: string;
    password_recovery_answer: string;
}

export default function Profile() {
    const store = useAuthStore()
    const [profile, setProfile] = useState<Profile>({
        email: '',
        password: '',
        password_confirmation: '',
        password_recovery_question: '',
        password_recovery_answer: ''
    })
    // const [buttonDisabled, setButtonDisabled] = useState<boolean>(false)
    const [changePassword, setChangePassword] = useState<boolean>(false)
    const [isMounted, setIsMounted] = useState<boolean>(false)
    const [selectedOption, setSelectedOption] = useState<OptionType | null>(null)
    
    const [options, setOptions] = useState<OptionType[]>([
        { value: "what is your mother's maiden name", label: "What is your mother's maiden name?" },
        { value: "what is the name of your first pet", label: "What is the name of your first pet?" },
        { value: "what was your first car", label: "What was your first car?" },
        { value: "what elementary school did you attend", label: "What elementary school did you attend?" },
        { value: "what is the name of the town where you were born", label: "What is the name of the town where you were born?" },
    ])

    const handleSubmit = async () => {
        const updatedForm = {
            user_id: store.user.id,
            email: profile.email,
            password: changePassword ? profile.password : '',
            password_recovery_question: selectedOption?.value,
            password_recovery_answer: profile.password_recovery_answer,
        }
        toast.promise(
            axios.post(`/api/verify`, updatedForm),
            {
                pending: 'Updating profile...',
                success: {
                    render() {
                        const user = store.user
                        store.getUser({
                            ...user,
                            email: profile.email,
                            password_recovery_question: profile.password_recovery_question,
                            password_recovery_answer: profile.password_recovery_answer
                        })
                        return 'Profile updated'
                    }
                },
                error: {
                    render({ data }: { data: AxiosResponse }) {
                        console.log(data)
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

    const setUserInformation = () => {
        const user = store.user
        const match = options.find((opt) => opt.value === user.password_recovery_question)
        if (match) {
            setSelectedOption(match);
        } else {
            const newOption = { value: user.password_recovery_question, label: user.password_recovery_question.charAt(0).toUpperCase() + user.password_recovery_question.slice(1) };
            setOptions((prevOptions) => [...prevOptions, newOption]);
            setSelectedOption(newOption);
        }
        setProfile({
            ...profile,
            email: user.email,
            password_recovery_question: user.password_recovery_question,
            password_recovery_answer: user.password_recovery_answer,
        })
    }

    useEffect(() => {
        setIsMounted(true)
        setUserInformation()
    }, [store.user])

    const validate = (e: FormEvent) => {
        e.preventDefault()
        const errs = []
        if (changePassword) {
            if (profile.password.trim() === '') {
                errs.push('Password is required')
            }
            if (profile.password_confirmation.trim() === '') {
                errs.push('Password confirmation is required')
            }
            if (profile.password !== profile.password_confirmation) {
                errs.push('Password did not match')
            }
        }
        if (errs.length > 0) {
            Swal.fire({
                text: errs.join('. ')
            })
        } else {
            handleSubmit()
        }
    }

    if (!isMounted) {
        return null
    }

    const handleChange = (newValue: OptionType | null) => {
        setSelectedOption(newValue);
    }
    
    const handleCreate = (inputValue: string) => {
        const newOption = { label: inputValue, value: inputValue.toLowerCase() };
        setOptions((prevOptions) => [...prevOptions, newOption]);
        setSelectedOption(newOption);
    }

    return (
        <div>
            <Navigation />
            <ToastContainer position="bottom-right" />
            <div className="pt-32">
            <Header backTo={`/`} title="ACCOUNT" />
                <div className="w-full flex justify-center items-center">
                    <form onSubmit={validate} className="w-full md:w-1/2 justify-center items-center flex">
                        <div className="w-full max-w-96 space-y-4 p-5 md:px-0">
                            <div className="group w-full flex justify-center items-center bg-white rounded ring-2 focus-within:ring ring-black gap-2">
                                <label htmlFor="password_recovery_question" className="ml-2">
                                    <FaQuestionCircle className="text-xl" />
                                </label>
                                {/* <input 
                                    onChange={handleOnChange} 
                                    type="text" 
                                    name="password_recovery_question" 
                                    id="password_recovery_question" 
                                    className="w-full px-2 outline-none border-l border-black" 
                                    placeholder="Password Recover Question"
                                    value={profile.password_recovery_question}
                                    required
                                /> */}
                                
                                <div className="w-full">
                                        <CreatableSelect 
                                            options={options}
                                            value={selectedOption}
                                            onChange={handleChange}
                                            onCreateOption={handleCreate}
                                            isClearable
                                            placeholder="Password Recovery Question"
                                        />
                                </div>
                            </div>
                            <div className="group w-full flex justify-center items-center bg-white p-2 rounded ring-2 focus-within:ring ring-black gap-2">
                                <label htmlFor="password_recovery_answer" className="">
                                    <MdQuestionAnswer className="text-xl" />
                                </label>
                                <input 
                                    onChange={handleOnChange} 
                                    type="text" 
                                    name="password_recovery_answer" 
                                    id="password_recovery_answer" 
                                    className="w-full px-2 outline-none border-l border-black" 
                                    placeholder="Password Recover Answer"
                                    value={profile.password_recovery_answer}
                                    required
                                />
                            </div>
                            <div className="group w-full flex justify-center items-center bg-white p-2 rounded ring-2 focus-within:ring ring-black gap-2">
                                <label htmlFor="email" className="">
                                    <MdEmail className="text-xl" />
                                </label>
                                <input 
                                    onChange={handleOnChange} 
                                    type="email" 
                                    name="email" 
                                    id="email" 
                                    className="w-full px-2 outline-none border-l border-black" 
                                    placeholder="Email"
                                    value={profile.email}
                                    required
                                />
                            </div>
                            <button 
                                onClick={()=>setChangePassword(!changePassword)} 
                                type="button" 
                                className="p-1 rounded text-white text-xs font-bold bg-indigo-400 hover:bg-indigo-600 active:ring-2 ring-blue-400"
                            >
                            change password
                            </button>
                            <div 
                                className={`group w-full flex justify-center items-center bg-white p-2 rounded ring-2 focus-within:ring ring-black gap-2 ${!changePassword && 'bg-gray-600'}`}
                            >
                                <label htmlFor="password" className="">
                                    <FaLock className="text-xl" />
                                </label>
                                <input 
                                    onChange={handleOnChange} 
                                    type="password" 
                                    name="password" 
                                    id="password" 
                                    className="w-full px-2 outline-none border-l border-black" 
                                    placeholder="Password"
                                    value={profile.password}
                                    disabled={!changePassword}
                                />
                            </div>
                            <div 
                                className={`group w-full flex justify-center items-center bg-white p-2 rounded ring-2 focus-within:ring ring-black gap-2 ${!changePassword && 'bg-gray-600'}`}
                            >
                                <label htmlFor="password_confirmation" className="">
                                    <FaLock className="text-xl" />
                                </label>
                                <input 
                                    onChange={handleOnChange} 
                                    type="password" 
                                    name="password_confirmation" 
                                    id="password_confirmation" 
                                    className="w-full px-2 outline-none border-l border-black" 
                                    placeholder="Confirm Password"
                                    value={profile.password_confirmation}
                                    disabled={!changePassword}
                                />
                            </div>
                            <button type="submit" className="p-2 w-full rounded bg-yellow-600 hover:bg-yellow-500 text-white font-bold">
                                SAVE
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}