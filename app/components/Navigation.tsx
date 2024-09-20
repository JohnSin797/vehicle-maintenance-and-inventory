'use client'

import Link from "next/link"
import { FaRegBell } from "react-icons/fa";
import personImg from "@/assets/images/person-icon.jpg";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Navigation() {
    const router = useRouter()
    const [profileModal, setProfileModal] = useState<Boolean>(false)

    const logout = async () => {
        await axios.get('/api/auth')
        .then(response => {
            router.push('/auth/sign-in')
        })
        .catch(error => {
            console.log(error)
        })
    }

    return (
        <div className="w-full fixed flex justify-between items-center top-0 border-b border-cyan-400 text-white p-5 z-10 bg-img">
            <p className="text-xl font-bold">GUBAT TRANSPORT COOPERATIVE</p>
            <div className="flex justify-center items-center gap-10">
                <button className="flex flex-col justify-center items-center">
                    <div className="rounded-full ring ring-cyan-400 p-2 relative">
                        <div className="rounded-full w-5 h-5 absolute block top-[-3px] right-[-3px] border border-cyan-400 flex justify-center items-center bg-blue-950">
                            <p className="text-xs text-cyan-400">10</p>
                        </div>
                        <FaRegBell className="text-cyan-400 w-10 h-10" />
                    </div>
                    <p className="text-center text-sm">Notifications</p>
                </button>
                <div className="relative">
                    
                    <button onClick={()=>setProfileModal(!profileModal)} className="flex flex-col justify-center items-center">
                        <div className="rounded-full overflow-hidden w-[58px] h-[58px] relative flex justify-center items-center">
                            <Image src={personImg} alt="person" width={100} height={100} className="scale-150 absolute"/>
                        </div>
                        <p className="text-center text-sm">Admin</p>
                    </button>
                    <div className={`absolute w-96 p-5 rounded bg-white right-0 ${profileModal ? '' : 'hidden'}`}>
                        <button onClick={logout} className="w-full p-2 rounded bg-blue-400 hover:bg-blue-600 text-xs text-white font-bold">logout</button>
                    </div>
                </div>
            </div>
        </div>
    )
}