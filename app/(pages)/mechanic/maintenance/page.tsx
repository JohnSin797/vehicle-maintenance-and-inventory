'use client'

import Header from "@/app/components/Header"
import axios from "axios";
import { useCallback, useEffect, useState } from "react";

// interface User {
//     _id: string;
//     first_name: string;
//     middle_name: string;
//     last_name: string;
//     extension: string;
//     email: string;
// }

interface Report {
    _id: string;
    report_date: Date;
    bus_number: string;
    driver: string;
    conductor: string;
    report: string;
}

export default function VehicleMaintenance() {
    const [reports, setReports] = useState<Report[]>([])
    const [reportArr, setReportArr] = useState<Report[]>([])

    const handleSearch = (key: string) => {
        const temp = reportArr.filter(data => 
            data.bus_number.toLowerCase().includes(key.toLowerCase()) ||
            data.driver.toLowerCase().includes(key.toLowerCase()) ||
            data.conductor.toLowerCase().includes(key.toLowerCase()) 
        )
        setReports(temp)
    }

    const getReports = useCallback(async () => {
        await axios.get('/api/mechanic')
        .then(response => {
            const rep = response.data?.reports
            setReports(rep)
            setReportArr(rep)
        })
        .catch(error => {
            console.log(error)
        })
    }, [])

    useEffect(() => {
        getReports()
    }, [getReports])

    return(
        <div className="w-full flex flex-col items-center">
            <Header title="MAINTENANCE REPORTS" backTo={'/'} goTo={'/mechanic/maintenance/create'} searchFunction={handleSearch} />
            <section className="w-full bg-white min-h-80">
                <table className="w-full table-auto md:table-fixed text-center text-xs">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="p-2 border-x-2 border-black">Date</th>
                            <th className="p-2 border-x-2 border-black">Bus Number</th>
                            <th className="p-2 border-x-2 border-black">Driver</th>
                            <th className="p-2 border-x-2 border-black">Conductor</th>
                            <th className="p-2 w-1/3 border-x-2 border-black">Report</th>
                            <th className="p-2 w-1/5 border-x-2 border-black">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            reports.map((item,index)=>{
                                return(
                                    <tr key={index}>
                                        <td className="p-2 border-x-2 border-black">{new Date(item.report_date).toISOString().substring(0, 16)}</td>
                                        <td className="p-2 border-x-2 border-black">{item.bus_number}</td>
                                        <td className="p-2 border-x-2 border-black">
                                            {/* {item.driver.first_name} 
                                            {item.driver.middle_name} 
                                            {item.driver.last_name} 
                                            {item.driver?.extension} */}
                                            {item.driver}
                                        </td>
                                        <td className="p-2 border-x-2 border-black">{item.conductor}</td>
                                        <td className="p-2 border-x-2 border-black">{item.report}</td>
                                        <td className="p-2 border-x-2 border-black">
                                            <div className="w-full flex flex-wrap justify-center items-center gap-2">
                                                <button className="p-2 rounded text-xs text-white font-bold bg-indigo-400 hover:bg-indigo-600">Edit</button>
                                                <button className="p-2 rounded text-xs text-white font-bold bg-rose-400 hover:bg-rose-600">Archive</button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </section>
        </div>
    )
}