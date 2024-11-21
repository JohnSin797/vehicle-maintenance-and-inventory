'use client'

import Header from "@/app/components/Header"
import axios from "axios"
import { useCallback, useEffect, useState } from "react"

interface Item {
    _id: string;
    item_name: string;
}

export default function Inventory({ params }: { params: { slug: string } }) {
    const [inventory, setInventory] = useState<Item>({
        _id: '',
        item_name: ''
    })

    const getData = useCallback(async () => {
        await axios.get(`/api/inventory?inventory_id=${params.slug}`)
        .then(response => {
            const inv = response.data?.inventory
            setInventory(inv)
        })
        .catch(error => {
            console.log(error)
        })
    }, [])

    useEffect(() => {
        getData()
    }, [getData])

    return(
        <div className="w-full">
            <Header title={inventory?.item_name} backTo={'/inventory/inventory'}/>
        </div>
    )
}