'use client'

import { ChangeEvent, FC, FormEvent, useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import person from '@/assets/images/person.jpg';
import lock from '@/assets/images/lock.jpg';
import logo from '@/assets/images/app-logo.jpg';
import Image from "next/image";
import { MdEmail } from "react-icons/md";
import { IoMdBriefcase } from "react-icons/io";
import axios from "axios";
import Swal from "sweetalert2";
import { useAuthStore } from "../stores/auth";
import { useRouter } from "next/navigation";
import CreatableSelect from "react-select/creatable";

interface SignUpProps {
    isHidden: boolean;
    setIsHidden: ()=>void;
}

interface User {
    first_name: string;
    middle_name: string;
    last_name: string;
    extension: string;
    email: string;
    password: string;
    password_confirmation: string;
    position: string;
    password_recovery_question: string;
    password_recovery_answer: string;
}

type OptionType = {
    label: string;
    value: string;
}

const SignUpModal: FC<SignUpProps> = ({ isHidden, setIsHidden }) => {
    const [signUpForm, setSignUpForm] = useState<User>({
        first_name: '',
        middle_name: '',
        last_name: '',
        extension: '',
        email: '',
        password: '',
        password_confirmation: '',
        position: 'driver',
        password_recovery_question: '',
        password_recovery_answer: '',
    })
    const [errors, setErrors] = useState<{
        first_name: string;
        middle_name: string;
        last_name: string;
        extension: string;
        email: string;
        password: string;
        password_confirmation: string;
        position: string;
    }>({
        first_name: '',
        middle_name: '',
        last_name: '',
        extension: '',
        email: '',
        password: '',
        password_confirmation: '',
        position: '',
    })
    const [options, setOptions] = useState<OptionType[]>([
        { value: "what is your mother's maiden name", label: "What is your mother's maiden name?" },
        { value: "what is the name of your first pet", label: "What is the name of your first pet?" },
        { value: "what was your first car", label: "What was your first car?" },
        { value: "what elementary school did you attend", label: "What elementary school did you attend?" },
        { value: "what is the name of the town where you were born", label: "What is the name of the town where you were born?" },
    ])
    const [selectedOption, setSelectedOption] = useState<OptionType | null>(null)
    const [nextPanel, setNextPanel] = useState<boolean>(false)
    const [isMounted, setIsMounted] = useState<boolean>(false)
    const store = useAuthStore()
    const router = useRouter()
    
    const handleOnChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setSignUpForm({
            ...signUpForm,
            [name]: value
        })
    }

    const validateForm = () => {
        setErrors({
            first_name: '',
            middle_name: '',
            last_name: '',
            extension: '',
            email: '',
            password: '',
            password_confirmation: '',
            position: '',
        })
        const errs = {
            first_name: '',
            middle_name: '',
            last_name: '',
            extension: '',
            email: '',
            password: '',
            password_confirmation: '',
            position: '',
        }
        let valid = true
        if (signUpForm.first_name === '') {
            errs.first_name = 'First name is required'
            valid = false
        }
        if (signUpForm.middle_name === '') {
            errs.middle_name = 'Middle name is required'
            valid = false
        }
        if (signUpForm.last_name === '') {
            errs.last_name = 'Last name is required'
            valid = false
        }
        if (signUpForm.email === '') {
            errs.email = 'Email is required'
            valid = false
        }
        if (signUpForm.password === '') {
            errs.password = 'Password is required'
            valid = false
        }
        if (signUpForm.password_confirmation === '') {
            errs.password_confirmation = 'Confirm password is required'
            valid = false
        }
        if (signUpForm.password !== signUpForm.password_confirmation) {
            errs.password_confirmation = 'Password did not match'
            valid = false
        }
        setErrors(errs)
        if (valid) {
            setNextPanel(!nextPanel)
        } 
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        const updatedForm: User = {
            ...signUpForm,
            password_recovery_question: selectedOption?.value ?? ''
        }
        await axios.post('/api/users', updatedForm)
        .then(response => {
            store.getUser(response.data?.user)
            router.push('/driver/report')
        })
        .catch(err => {
            console.log(err)
            Swal.fire({
                title: 'Sign Up Error',
                text: err.response?.data?.message,
                icon: 'error'
            })
        })
    }

    const handleChange = (newValue: OptionType | null) => {
        setSelectedOption(newValue);
    }
    
    const handleCreate = (inputValue: string) => {
        const newOption = { label: inputValue, value: inputValue.toLowerCase() };
        setOptions((prevOptions) => [...prevOptions, newOption]);
        setSelectedOption(newOption);
    }

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted) {
        return null
    }

    return(
        <div className={`${isHidden ? 'w-full min-h-screen fixed top-0 left-0 bg-blue-950/50 backdrop-blur-md flex justify-center items-center' : 'hidden'}`}>
            <section className="rounded-lg bg-white p-5 max-h-[600px] overflow-auto">
                <header className="w-full mb-5 flex justify-between items-center">
                    <h1 className="text-xl font-bold">Sign Up</h1>
                    <button onClick={setIsHidden} className="p-2 rounded active:ring-2 ring-blue-400 hover:border-rose-400  border-white border hover:text-rose-400">
                        <IoMdClose />
                    </button>
                </header>
                <form onSubmit={handleSubmit} className="w-full">
                    <div className={`overflow-hidden w-[280px] md:w-[550px]`}>
                        <div className={`flex transition-transform duration-500 ${nextPanel && '-translate-x-[280px] md:-translate-x-[550px]'}`}>
                            <div className="">
                                <div className="p-5 w-[280px] md:w-[550px] flex flex-col md:flex-row justify-center items-center gap-2">
                                    <div className="w-full flex flex-col gap-1">
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
                                            />
                                        </div>
                                        <p className="block h-4 text-rose-400 text-xs">{errors.first_name}</p>
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
                                            />
                                        </div>
                                        <p className="block h-4 text-rose-400 text-xs">{errors.middle_name}</p>
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
                                            />
                                        </div>
                                        <p className="block h-4 text-rose-400 text-xs">{errors.last_name}</p>
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
                                            />
                                        </div>
                                        <p className="block h-4 text-rose-400 text-xs">{errors.extension}</p>
                                    </div>
                                    <div className="w-full flex flex-col gap-1">
                                        <div className="group w-full flex justify-center items-center bg-white p-2 rounded ring-2 focus-within:ring ring-black gap-2">
                                            <label htmlFor="position" className="">
                                                <IoMdBriefcase className="text-black w-5 h-5" />
                                            </label>
                                            <select onChange={handleOnChange} name="position" id="position" className="w-full px-2 outline-none border-l border-black">
                                                <option value="driver">Driver</option>
                                                <option value="mechanic">Mechanic</option>
                                                <option value="inventory">Inventory Personel</option>
                                            </select>
                                        </div>
                                        <p className="block h-4 text-rose-400 text-xs">{errors.position}</p>
                                        <div className="group w-full flex justify-center items-center bg-white p-2 rounded ring-2 focus-within:ring ring-black gap-2">
                                            <label htmlFor="email" className="">
                                                {/* <Image src={person} alt="person-icon" width={20} height={20} /> */}
                                                <MdEmail className="text-black w-5 h-5" />
                                            </label>
                                            <input 
                                                onChange={handleOnChange} 
                                                type="email" 
                                                name="email" 
                                                id="email" 
                                                className="w-full px-2 outline-none border-l border-black" 
                                                placeholder="Email"
                                            />
                                        </div>
                                        <p className="block h-4 text-rose-400 text-xs">{errors.email}</p>
                                        <div className="group w-full flex justify-center items-center bg-white p-2 rounded ring-2 focus-within:ring ring-black gap-2">
                                            <label htmlFor="password" className="">
                                                <Image src={lock} alt="lock-icon" width={20} height={20} />
                                            </label>
                                            <input 
                                                onChange={handleOnChange} 
                                                type="password" 
                                                name="password" 
                                                id="password" 
                                                className="w-full px-2 outline-none border-l border-black" 
                                                placeholder="Password"
                                            />
                                        </div>
                                        <p className="block h-4 text-rose-400 text-xs">{errors.password}</p>
                                        <div className="group w-full flex justify-center items-center bg-white p-2 rounded ring-2 focus-within:ring ring-black gap-2">
                                            <label htmlFor="password_confirmation" className="">
                                                <Image src={lock} alt="lock-icon" width={20} height={20} />
                                            </label>
                                            <input 
                                                onChange={handleOnChange} 
                                                type="password" 
                                                name="password_confirmation" 
                                                id="password_confirmation" 
                                                className="w-full px-2 outline-none border-l border-black" 
                                                placeholder="Confirm password"
                                            />
                                        </div>
                                        <p className="block h-4 text-rose-400 text-xs">{errors.password_confirmation}</p>
                                    </div>
                                </div>
                                <div className="flex justify-center items-center">
                                    
                                <button type="button" onClick={validateForm} className="p-2 text-sm text-white font-semibold bg-blue-400 hover:bg-blue-600 rounded">continue</button>
                                </div>
                            </div>
                            <div className="">
                                <div className="p-5 w-[280px] md:w-[550px] space-y-3">
                                    <h1 className="text-xl font-semibold">Forgot Password</h1>
                                    <div className="group w-full">
                                        <label htmlFor="question" className="text-xs font-bold">Password Recovery Question:</label>
                                        <CreatableSelect 
                                            options={options}
                                            value={selectedOption}
                                            onChange={handleChange}
                                            onCreateOption={handleCreate}
                                            isClearable
                                        />
                                        {}
                                    </div>
                                    <div className="group w-full">
                                        <label htmlFor="password_recovery_answer" className="text-xs font-bold">Answer:</label>
                                        <input 
                                            type="text" 
                                            name="password_recovery_answer" 
                                            id="password_recovery_answer" 
                                            className="p-2 w-full rounded text-sm border border-black" 
                                            onChange={handleOnChange}
                                            value={signUpForm.password_recovery_answer}
                                            required
                                        />
                                    </div>
                                    <div className="flex justify-center items-center gap-2">
                                        <button onClick={()=>setNextPanel(!nextPanel)} type="button" className="p-2 text-sm text-white font-semibold rounded bg-blue-400 hover:bg-blue-600">back</button>
                                        <button type="submit" className="p-2 text-sm text-white font-semibold rounded bg-amber-400 hover:bg-amber-600">submit</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </section>
        </div>
    )
}

export default SignUpModal