'use client'

import { ChangeEvent, FormEvent, useEffect, useState } from "react"

export default function Create() {

    const [reportForm, setReportForm] = useState<{ 
        report_date: string,
        bus_number: string,
        driver: string,
        conductor: string,
        report: string,
     }>({
        report_date: '',
        bus_number: '',
        driver: '',
        conductor: '',
        report: '',
    })
 
    const handleReport = async (e: FormEvent) => {
        e.preventDefault();

    }

    const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target
        setReportForm((prevForm) => ({
            ...prevForm,
            [name]: value
        }))
        console.log(value)
    }

    useEffect(()=>{

    })

    return (
        <div className="w-full min-h-screen flex justify-center items-center">
            <section className="w-96 rounded-lg shadow-xl p-10 bg-white">
                <header className="mb-5">
                    <h1 className="text-2xl font-bold">Create Report</h1>
                </header>
                <form>
                    <div className="w-full space-y-2">
                        <div className="group w-full">
                            <label htmlFor="report_date" className="text-xs font-bold">Date:</label>
                            <input onChange={handleOnChange} type="date" name="report_date" id="report_date" className="p-2 rounded border border-black w-full" />
                        </div>
                        <div className="group w-full">
                            <label htmlFor="bus_number" className="text-xs font-bold">Bus Number:</label>
                            <input type="text" name="bus_number" id="bus_number" className="p-2 rounded border border-black w-full" />
                        </div>
                        <div className="group w-full">
                            <label htmlFor="conductor" className="text-xs font-bold">Conductor:</label>
                            <input type="text" name="conductor" id="conductor" className="p-2 rounded border border-black w-full" />
                        </div>
                        <div className="group w-full">
                            <label htmlFor="report" className="text-xs font-bold">Report:</label>
                            <textarea name="report" id="report" className="p-2 rounded border border-black resize-none w-full"></textarea>
                        </div>
                        <button type="submit" className="w-full p-2 rounded bg-indigo-400 hover:bg-indigo-600 text-white font-bold">Create</button>
                    </div>
                </form>
            </section>
        </div>
    )
}