'use client'

import Header from "@/app/components/Header"
import axios, { AxiosResponse } from "axios"
import { useCallback, useEffect, useState } from "react"
import { ToastContainer, toast } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'
import Swal from "sweetalert2"

interface Product {
    _id: string;
    item_name: string;
    brand: string;
    description: string[];
}

export default function Product() {
    const [products, setProducts] = useState<Product[]>([])

    const searchFunction = () => {

    }

    const getProducts = useCallback(async () => {
        await axios.get('/api/product')
        .then(response => {
            const p = response.data?.products
            setProducts(p)
        })
        .catch(() => {
            toast.error('ERROR')
        })
    }, [])

    useEffect(() => {
        getProducts()
    }, [getProducts])

    const confirmDelete = (id: string, index: number) => {
        Swal.fire({
            title: 'Delete Confirmation',
            text: `Are you sure you want to delete ${products[index].item_name}?`,
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
            axios.patch(`/api/product?product_id=${id}`),
            {
                pending: 'Deleting product...',
                success: {
                    render({ data }: { data: AxiosResponse }) {
                        const prod = data.data?.product
                        setProducts(prod ?? [])
                        return 'Product deleted'
                    }
                },
                error: 'Failed to delete'
            }
        )
    }

    return(
        <div className="w-full">
            <ToastContainer position="bottom-right" />
            <Header title="PRODUCTS" backTo={'/admin/purchase-order'} goTo={'/admin/product/create'} goTo2={{path: '/admin/product/archive', title: 'Archive'}} searchFunction={searchFunction} />
            <section className="w-full bg-white min-h-80 2xl:min-h-96">
                <table className="w-full table-auto md:table-fixed text-center">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="p-2 border-x-2 border-black">Item Name</th>
                            <th className="p-2 border-x-2 border-black">Brand</th>
                            <th className="p-2 border-x-2 border-black">Description</th>
                            <th className="p-2 border-x-2 border-black"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            products.map((product, index) => {
                                return(
                                    <tr key={index}>
                                        <td className="p-2 border-x-2 border-black">{product.item_name}</td>
                                        <td className="p-2 border-x-2 border-black">{product.brand}</td>
                                        <td className="p-2 border-x-2 border-black">
                                            {
                                                product.description.map((desc, idx) => {
                                                    return (
                                                        <p key={idx}>{desc}</p>
                                                    )
                                                })
                                            }
                                        </td>
                                        <td className="p-2 border-x-2 border-black">
                                            <button onClick={()=>confirmDelete(product._id, index)} className="p-2 rounded text-sm text-white font-bold bg-red-400 hover:bg-red-600">
                                                Archive
                                            </button>
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