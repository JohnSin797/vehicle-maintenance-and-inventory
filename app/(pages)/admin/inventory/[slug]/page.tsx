'use client'

import Header from "@/app/components/Header"
import axios from "axios";
import { useCallback, useEffect, useState } from "react"

interface Item {
    _id: string;
    item_name: string;
}

interface Order {
    inventory: Item;
    date_received: Date;
    quantity: number;
}

export default function Inventory({ params }: { params: { slug: string } }) {
    const [item, setItem] = useState<Item>({
        _id: '',
        item_name: ''
    })
    const [itemIn, setItemIn] = useState<Order[]>([])
    // const [itemOut, setItemOut] = useState()

    const getData = useCallback(async () => {
        await axios.get(`/api/inventory?inventory_id=${params.slug}`)
        .then(response => {
            const inv = response.data?.inventory
            const po = response.data?.orders
            setItem(inv)
            setItemIn(po)
        })
    }, [])

    useEffect(() => {
        getData()
    }, [getData])

    return (
        <div className="w-full">
            <Header title={item.item_name} backTo={'/admin/inventory'} />
            <section className="w-full bg-white min-h-80 2xl:min-h-96 flex text-center">
                <div className="w-full md:w-2/5">
                    <header className="bg-slate-300 text-xl font-bold p-2">STOCK (IN)</header>
                    <table className="w-full table-auto md:table-fixed">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="border-x-2 border-black p-2">Date</th>
                                <th className="border-x-2 border-black p-2">Type</th>
                                <th className="border-x-2 border-black p-2">Quantity</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                itemIn.map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            <td className="border-x-2 border-black p-2">{new Date(item.date_received).toLocaleDateString('en-PH')}</td>
                                            <td className="border-x-2 border-black p-2">{item.inventory.item_name}</td>
                                            <td className="border-x-2 border-black p-2">{item.quantity}</td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>
                <div className="w-full md:w-3/5">
                    <header className="bg-stone-400 text-xl font-bold p-2">STOCK (OUT)</header>
                    <table className="w-full table-auto md:table-fixed">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="border-r-2 border-black p-2">Body No.</th>
                                <th className="border-x-2 border-black p-2">Date</th>
                                <th className="border-x-2 border-black p-2">Type</th>
                                <th className="border-x-2 border-black p-2">Quantity Details</th>
                            </tr>
                        </thead>
                    </table>
                </div>
            </section>
        </div>
    )
}