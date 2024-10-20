'use client'

import { ToastContainer, toast } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'
import Header from "@/app/components/Header"
import { useCallback, useEffect, useState } from "react"
import axios, { AxiosResponse } from "axios"
import Swal from "sweetalert2"

interface Item {
    _id: string;
    item_name: string;
    brand: string;
    description: string[];
    deletedAt: Date;
}

export default function Archive() {
    const [archive, setArchive] = useState<Item[]>([])

    const handleSearch = () => {

    }

    const getArchive = useCallback(async () => {
        await axios.get('/api/product/archive')
        .then(response => {
            const products = response.data?.products
            setArchive(products)
        })
        .catch(error => {
            console.log(error)
        })
    }, [])

    useEffect(() => {
        getArchive()
    }, [getArchive])

    const confirmRestore = (id: string) => {
        Swal.fire({
            title: 'Restore Product',
            text: 'Are you sure you want to restore product?',
            icon: 'question',
            showCancelButton: true,
            showConfirmButton: true,
            confirmButtonColor: 'indigo',
            cancelButtonColor: 'red',
        })
        .then(response => {
            if (response.isConfirmed) {
                restoreProduct(id)
            }
        })
    }

    const restoreProduct = async (id: string) => {
        toast.promise(
            axios.patch(`/api/product/archive?product_id=${id}`),
            {
                pending: 'Restoring product...',
                success: {
                    render({ data }: { data: AxiosResponse }) {
                        const products = data.data?.products
                        setArchive(products ?? [])
                        return 'Product restored'
                    }
                },
                error: {
                    render({ data }: { data: AxiosResponse }) {
                        Swal.fire({
                            title: 'Delete Error',
                            text: data.data?.message
                        })
                        return 'ERROR'
                    }
                }
            }
        )
    }

    const confirmDelete = (id: string) => {
        Swal.fire({
            title: 'Delete Product',
            text: 'Are you sure you want to delete product?',
            icon: 'question',
            showCancelButton: true,
            showConfirmButton: true,
            confirmButtonColor: 'indigo',
            cancelButtonColor: 'red',
        })
        .then(response => {
            if (response.isConfirmed) {
                deleteProduct(id)
            }
        })
    }

    const deleteProduct = async (id: string) => {
        toast.promise(
            axios.delete(`/api/product/archive?product_id=${id}`),
            {
                pending: 'Deleting product',
                success: {
                    render({ data }: { data: AxiosResponse }) {
                        const products = data.data?.products
                        setArchive(products ?? [])
                        return 'Product deleted'
                    }
                },
                error: {
                    render({ data }: { data: AxiosResponse }) {
                        Swal.fire({
                            title: 'Delete Error',
                            text: data.data?.message
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
            <Header title="PRODUCT ARCHIVE" backTo={'/admin/product'} searchFunction={handleSearch} />
            <section className="w-full bg-white min-h-80 2xl:min-h-96">
                <table className="w-full table-auto md:table-fixed text-center">
                    <thead className="bg-gray-200">
                        <tr>
                            <th>Item Name</th>
                            <th>Brand</th>
                            <th>Description</th>
                            <th>Date Deleted</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            archive.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{item.item_name}</td>
                                        <td>{item.brand}</td>
                                        <td>{item.description.map((desc,idx)=>{
                                            return (
                                                <p key={idx}>{desc}</p>
                                            )
                                        })}</td>
                                        <td>{new Date(item.deletedAt).toLocaleDateString('en-PH')}</td>
                                        <td>
                                            <div className="w-full flex flex-wrap justify-center items-center gap-2">
                                                <button onClick={()=>confirmRestore(item._id)} className="p-2 rounded text-sm text-white font-bold bg-blue-400 hover:bg-blue-600">Restore</button>
                                                <button onClick={()=>confirmDelete(item._id)} className="p-2 rounded text-sm text-white font-bold bg-rose-400 hover:bg-rose-600">Delete</button>
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