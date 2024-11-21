'use client'

import axios, { AxiosResponse } from "axios";
import { ChangeEvent, FormEvent, useCallback, useEffect, useState } from "react"
import { useAuthStore } from "@/app/stores/auth";
import Header from "@/app/components/Header";
import { ToastContainer, toast } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';
import Swal from "sweetalert2";
import Select, { MultiValue } from "react-select";

interface FormState {
    bus_number: string,
    driver: string,
    conductor: string,
    report: string[],
}

interface Inventory {
    _id: string;
    item_name: string;
}

interface ItemOptions {
    value: string;
    label: string;
}

export default function Create() {
    const [isMounted, setIsMounted] = useState<boolean>(false)
    const [itemOptions, setItemOptions] = useState<ItemOptions[]>([])
    const [reportForm, setReportForm] = useState<FormState>({
        bus_number: '',
        driver: '',
        conductor: '',
        report: [],
    })
    const store = useAuthStore()
 
    const handleReport = async (e: FormEvent) => {
        e.preventDefault();
        const updatedForm: FormState = {
            ...reportForm,
            driver: store.user.id
        }
        toast.promise(
            axios.post('/api/drivers', updatedForm),
            {
                pending: 'Creating report',
                success: {
                    render({ data }: { data: AxiosResponse }) {
                        console.log(data)
                        setReportForm({
                            bus_number: '',
                            driver: store.user.id,
                            conductor: '',
                            report: [],
                        })
                        return 'Report created'
                    }
                },
                error: {
                    render({ data }: { data: AxiosResponse }) {
                        Swal.fire({
                            title: 'Report Error',
                            text: data.data?.message,
                            icon: 'error'
                        })
                        console.log(data)
                        return 'ERROR'
                    }
                }
            }
        )
    }

    const handleOnChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target
        setReportForm((prevForm) => ({
            ...prevForm,
            [name]: value
        }))
    }

    const handleSelectChange = (selectedOption: MultiValue<ItemOptions>) => {
        const temp = selectedOption.map((item) => item.value)
        setReportForm({
            ...reportForm,
            report: temp
        })
    }

    const setOptions = (items: Inventory[]) => {
        const newArr = items.map((inv)=>{
            return {
                value: inv._id,
                label: inv.item_name,
            }
        })
        setItemOptions(newArr)
    }

    const getInventory = useCallback(async () => {
        await axios.get('/api/inventory')
        .then(response => {
            const inv = response.data?.inventory
            setOptions(inv)
            // setInventory(inv)
        })
        .catch(error => {
            console.log(error)
        })
    }, [])

    useEffect(()=>{
        setIsMounted(true)
        getInventory()
    }, [getInventory])
    
    if (!isMounted) {
        return null
    }

    return (
        <div className="w-full">
            <ToastContainer position="bottom-right" />
            <Header title="CREATE DRIVER REPORT" backTo={'/driver/report'} />
            <div className="w-full flex justify-center items-center">
                <section className="w-96">
                    <form onSubmit={handleReport}>
                        <div className="w-full space-y-2">
                            {/* <div className="group w-full">
                                <label htmlFor="report_date" className="text-xs text-amber-400 font-bold">Date:</label>
                                <input 
                                    onChange={handleOnChange} 
                                    type="datetime-local" 
                                    name="report_date" 
                                    id="report_date" 
                                    className="p-2 rounded border border-black w-full" 
                                    value={reportForm.report_date ? new Date(reportForm.report_date).toISOString().substring(0, 16) : ''}
                                />
                            </div> */}
                            <div className="group w-full">
                                <label htmlFor="bus_number" className="text-xs text-amber-400 font-bold">Bus Number:</label>
                                <input 
                                    type="text" 
                                    name="bus_number" 
                                    id="bus_number" 
                                    className="p-2 rounded border border-black w-full" 
                                    value={reportForm.bus_number}
                                    onChange={handleOnChange}
                                />
                            </div>
                            <div className="group w-full">
                                <label htmlFor="conductor" className="text-xs text-amber-400 font-bold">Conductor:</label>
                                <input 
                                    type="text" 
                                    name="conductor" 
                                    id="conductor" 
                                    className="p-2 rounded border border-black w-full" 
                                    value={reportForm.conductor}
                                    onChange={handleOnChange}
                                />
                            </div>
                            <div className="group w-full">
                                <label htmlFor="report" className="text-xs text-amber-400 font-bold">Report:</label>
                                {/* <textarea 
                                    name="report" 
                                    id="report" 
                                    className="p-2 rounded border border-black resize-none w-full"
                                    value={reportForm.report}
                                    onChange={handleOnChange}
                                ></textarea> */}
                                <Select 
                                    isMulti
                                    options={itemOptions}
                                    onChange={handleSelectChange}
                                />
                            </div>
                            <button type="submit" className="w-full p-2 rounded bg-amber-400 hover:bg-amber-600 text-white font-bold">Create</button>
                        </div>
                    </form>
                </section>
            </div>
        </div>
    )
}