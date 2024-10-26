'use client'

import Header from "@/app/components/Header"
import axios, { AxiosResponse } from "axios";
import { FormEvent, useState } from "react"
import { ToastContainer, toast } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';

export default function Create() {
    const [itemName, setItemName] = useState<string>('')

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        toast.promise(
            axios.post('/api/inventory', { item_name: itemName }),
            {
                pending: 'Creating item...',
                success: {
                    render() {
                        setItemName('')
                        return 'Item created'
                    }
                },
                error: {
                    render({ data }: { data: AxiosResponse }) {
                        return data.data?.message
                    }
                }
            }
        )
    }

    return (
        <div className="w-full">
            <ToastContainer position="bottom-right" />
            <Header title="CREATE INVENTORY ITEM" backTo={'/admin/inventory'} />
            <section className="w-full flex justify-center items-center">
                <form onSubmit={handleSubmit}>
                    <div className="w-96 space-y-2">
                        <div className="w-full">
                            <label htmlFor="item_name" className="text-xs text-amber-400 font-bold">Item Name:</label>
                            <input 
                                type="text" 
                                name="item_name" 
                                id="item_name" 
                                className="w-full p-2 text-sm rounded" 
                                value={itemName}
                                onChange={(e)=>setItemName(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="w-full p-2 text-sm text-white font-bold rounded bg-amber-400 hover:bg-amber-600">SUBMIT</button>
                    </div>
                </form>
            </section>
        </div>
    )
}