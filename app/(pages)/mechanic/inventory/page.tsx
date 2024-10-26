'use client'

import Header from "@/app/components/Header"

export default function InventoryReport() {
    const handleSearch = () => {

    }

    return(
        <div className="w-full">
            <Header title="INVENTORY REPORT" backTo={'/'} searchFunction={handleSearch} goTo={'/mechanic/inventory/create'} />
        </div>
    )
}