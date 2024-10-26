'use client'

import Header from "@/app/components/Header"

export default function Create() {
    return(
        <div className="w-full">
            <Header title="CREATE INVENTORY REPORT" backTo={'/mechanic/inventory'} />
        </div>
    )
}