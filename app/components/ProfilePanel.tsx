'use client'

import { FC } from "react"
import { useAuthStore } from "../stores/auth";
import { IoCloseSharp } from "react-icons/io5";
import Link from "next/link";

interface ProfileProps {
    isHidden: boolean;
    handleLogout: ()=>Promise<void>;
    toggle: ()=>void;
}

const ProfilePanel: FC<ProfileProps> = ({ isHidden, handleLogout, toggle }) => {
    const store = useAuthStore()

    return (
        <div className={`fixed bottom-0 right-0 w-full md:w-96 z-10 bg-img ${isHidden && 'hidden'}`}>
            <div className="w-full h-full bg-blue-950/80 p-5">
                <section className="w-full">
                    <header className="mb-5 font-semibold flex justify-between items-center border-b border-cyan-400">
                        <h1 className="text-xl">
                            <span>{store.user.first_name} {store.user.middle_name} {store.user.last_name} {store.user.extension}</span>
                        </h1>
                        <button type="button" className="active:border rounded p-1 border-cyan-400" onClick={()=>toggle()}>
                            <IoCloseSharp />
                        </button>
                    </header>
                </section>
                <div className="w-full h-96 flex flex-col gap-5">
                    <Link href={'/profile'} className="w-full p-2 rounded text-sm text-white text-center font-semibold bg-indigo-400 hover:bg-indigo-600">Profile</Link>
                    <Link href={'/profile'} className="w-full p-2 rounded text-sm text-white text-center font-semibold bg-violet-400 hover:bg-violet-600">Change Password</Link>
                    <button onClick={()=>handleLogout()} type="button" className="w-full p-2 rounded text-sm text-white font-semibold bg-blue-400 hover:bg-blue-600">logout</button>
                </div>
            </div>
        </div>
    )
}

export default ProfilePanel