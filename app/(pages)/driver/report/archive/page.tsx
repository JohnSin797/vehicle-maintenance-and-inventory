'use client'

import Header from "@/app/components/Header";
import axios, { AxiosResponse } from "axios";
import { useCallback, useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Swal from "sweetalert2";

interface User {
    _id: string;
    first_name: string;
    middle_name: string;
    last_name: string;
    extension: string;
    email: string;
}

interface Report {
    _id: string;
    report_date: Date;
    bus_number: string;
    driver: User;
    conductor: string;
    report: [{item_name: ''}];
}

export default function Archive() {
    const [reports, setReports] = useState<Report[]>([])
    const [reportArr, setReportArr] = useState<Report[]>([])

    const getReportArchives = useCallback(async () => {
        await axios.get('/api/drivers/archive')
        .then(response => {
            const rep = response.data?.reports
            setReports(rep)
            setReportArr(rep)
        })
    }, [])

    useEffect(() => {
        getReportArchives()
    }, [getReportArchives])

    const handleSearch = (key: string) => {
        const temp = reportArr.filter(data => 
            data.bus_number.toLowerCase().includes(key.toLowerCase()) ||
            data.conductor.toLowerCase().includes(key.toLowerCase()) 
        )
        setReports(temp)
    }

    const confirmDelete = (id: string) => {
        Swal.fire({
            title: 'Delete Confirmation',
            text: 'Are you sure you want to permanently delete report?',
            icon: 'question',
            showCancelButton: true,
            showConfirmButton: true,
            cancelButtonColor: 'red',
            confirmButtonColor: 'indigo',
        })
        .then(response => {
            if (response.isConfirmed) {
                deleteReport(id)
            }
        })
    }

    const deleteReport = async (id: string) => {
        toast.promise(
            axios.delete(`/api/drivers/archive?report_id=${id}`),
            {
                pending: 'Deleting report...',
                success: {
                    render({ data }: { data: AxiosResponse }) {
                        const rep = data?.data?.reports
                        setReports(rep)
                        setReportArr(rep)
                        return 'Report deleted'
                    }
                },
                error: {
                    render({ data }: { data: AxiosResponse }) {
                        Swal.fire({
                            title: 'Report Delete Error',
                            text: data?.data?.message,
                            icon: 'error'
                        })
                        return 'ERROR'
                    }
                }
            }
        )
    }

    const confirmRestore = (id: string) => {
        Swal.fire({
            title: 'Restore Confirmation',
            text: 'Are you sure you want to restore report?',
            icon: 'question',
            showCancelButton: true,
            showConfirmButton: true,
            cancelButtonColor: 'red',
            confirmButtonColor: 'indigo',
        })
        .then(response => {
            if (response.isConfirmed) {
                restoreReport(id)
            }
        })
    }

    const restoreReport = async (id: string) => {
        toast.promise(
            axios.patch(`/api/drivers/archive?report_id=${id}`),
            {
                pending: 'Restoring report...',
                success: {
                    render({ data }: { data: AxiosResponse }) {
                        const rep = data?.data?.reports
                        setReports(rep)
                        setReportArr(rep)
                        return 'Report restored'
                    }
                },
                error: {
                    render({ data }: { data: AxiosResponse }) {
                        Swal.fire({
                            title: 'Report Restore Error',
                            text: data?.data?.message,
                            icon: 'error'
                        })
                        return 'ERROR'
                    }
                }
            }
        )
    }

    return (
        <div className="w-full">
            <ToastContainer position="bottom-right" />
            <Header title="DRIVER REPORT ARCHIVE" backTo={'/driver/report'} searchFunction={handleSearch} />
            <section className="w-full bg-white min-h-80">
                <table className="w-full table-auto md:table-fixed text-center text-sm">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="border-x-2 border-black p-2">Date</th>
                            <th className="border-x-2 border-black p-2">Bus Number</th>
                            <th className="border-x-2 border-black p-2">Driver</th>
                            <th className="border-x-2 border-black p-2">Conductor</th>
                            <th className="w-1/3 border-x-2 border-black p-2">Report</th>
                            <th className="w-1/4 border-x-2 border-black p-2">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            reports.map((item,index)=>{
                                return(
                                    <tr key={index}>
                                        <td className="p-2 border-x-2 border-black">{new Date(item.report_date).toLocaleDateString('en-US')}</td>
                                        <td className="p-2 border-x-2 border-black">{item.bus_number}</td>
                                        <td className="p-2 border-x-2 border-black">
                                            {item.driver.first_name} 
                                            {item.driver.middle_name} 
                                            {item.driver.last_name} 
                                            {item.driver?.extension}
                                        </td>
                                        <td className="p-2 border-x-2 border-black">{item.conductor}</td>
                                        <td className="p-2 border-x-2 border-black">
                                            {
                                                item.report.map((rep,idx) => {
                                                    return <p key={idx}>{ rep?.item_name }</p>
                                                })
                                            }
                                        </td>
                                        <td className="p-2 border-x-2 border-black">
                                            <div className="w-full flex flex-wrap justify-center items-center gap-2">
                                                <button
                                                    onClick={()=>confirmDelete(item._id)}
                                                    className="p-2 rounded text-white font-bold bg-rose-400 hover:bg-rose-600"
                                                >
                                                    Delete
                                                </button>
                                                <button
                                                    onClick={()=>confirmRestore(item._id)}
                                                    className="p-2 rounded text-white font-bold bg-green-400 hover:bg-green-600"
                                                >
                                                    Restore
                                                </button>
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