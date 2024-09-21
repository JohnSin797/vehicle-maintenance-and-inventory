'use client'

import Link from "next/link"
import { FaRegBell } from "react-icons/fa";
import personImg from "@/assets/images/person-icon.jpg";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthStore } from "../stores/auth";

interface User {
    _id: string;
    first_name: string,
    middle_name: string,
    last_name: string;
    extension: string;
    email: string;
}

interface Notification {
    user: User;
    message: string;
    status: string;
    createdAt: Date;
}

interface NotificationState {
    notifications: Notification[];
    loading: Boolean;
}

export default function Navigation() {
    const router = useRouter()
    const store = useAuthStore()
    const [profileModal, setProfileModal] = useState<Boolean>(false)
    const [notificationModal, setNotificationModal] = useState<Boolean>(false)
    const [unreadCount, setUnreadCount] = useState<number>(0)
    const [notifications, setNotifications] = useState<NotificationState>({
        notifications: [],
        loading: true
    })

    const logout = async () => {
        await axios.get('/api/auth')
        .then(response => {
            store.removeUser()
            router.push('/auth/sign-in')
        })
        .catch(error => {
            console.log(error)
        })
    }

    const getNotifications = async () => {
        const user = store.user
        console.log(user.id)
        await axios.get(`/api/notifications?userId=${user.id}`)
        .then(response => {
            const notification = response.data?.notifications
            setNotifications({
                notifications: notification,
                loading: false
            })
            const count = notification.filter((data: Notification) => data?.status === 'unread').length
            setUnreadCount(count)
        })
        .catch(error => {
            console.log(error)
        })
    }

    useEffect(()=>{
        getNotifications()
    }, [store.user])

    return (
        <div className="w-full fixed flex justify-between items-center top-0 border-b border-cyan-400 text-white p-5 z-10 bg-img">
            <p className="text-lg md:text-2xl font-bold">GUBAT TRANSPORT COOPERATIVE</p>
            <div className="flex justify-center items-center gap-5 md:gap-10">
                <div className="relative">
                    <button onClick={()=>setNotificationModal(!notificationModal)} className="flex flex-col justify-center items-center">
                        <div className="rounded-full ring ring-cyan-400 p-2 relative">
                            {
                                unreadCount > 0 &&
                                <div className="rounded-full w-5 h-5 absolute block top-[-3px] right-[-3px] border border-cyan-400 flex justify-center items-center bg-blue-950">
                                    <p className="text-xs text-cyan-400">{unreadCount}</p>
                                </div>
                            }
                            <FaRegBell className="text-cyan-400 w-5 h-5 md:w-10 md:h-10" />
                        </div>
                        <p className="text-center text-sm">Notifications</p>
                    </button>
                    {
                        notificationModal &&
                        <div className="absolute w-96 p-5 rounded bg-white text-black right-0">
                            {
                                notifications.notifications.map((item,index)=>{
                                    return(
                                        <div className="mb-5 border-b border-black w-full" key={index}>
                                            <p className="text-center">{item.message}</p>
                                            <p className="text-xs font-bold">{new Date(item.createdAt).toLocaleTimeString('en-US')} {new Date(item.createdAt).toLocaleDateString('en-US')}</p>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    }
                </div>
                <div className="relative">
                    <button onClick={()=>setProfileModal(!profileModal)} className="flex flex-col justify-center items-center">
                        <div className="rounded-full overflow-hidden w-[40px] h-[40px] md:w-[58px] md:h-[58px] relative flex justify-center items-center">
                            <Image src={personImg} alt="person" width={100} height={100} className="scale-150 absolute"/>
                        </div>
                        <p className="text-center text-sm">Profile</p>
                    </button>
                    <div className={`absolute w-96 p-5 rounded bg-white right-0 ${profileModal ? '' : 'hidden'}`}>
                        <button onClick={logout} className="w-full p-2 rounded bg-blue-400 hover:bg-blue-600 text-xs text-white font-bold">logout</button>
                    </div>
                </div>
            </div>
        </div>
    )
}