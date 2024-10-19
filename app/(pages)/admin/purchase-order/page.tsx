'use client'

import Header from "@/app/components/Header"

export default function PurchaseOrder() {

    const searchFunction = () => {

    }

    return (
        <div className="w-full">
            <Header title="PURCHASE ORDERS" backTo={'/'} searchFunction={searchFunction} goTo={'/admin/purchase-order/create'} goTo2={{path: '/admin/product', title: 'Products'}} />
            <section className="w-full bg-white min-h-80 2xl:min-h-96">
                <table className="w-full table-auto md:table-fixed text-center">
                    <thead className="bg-gray-200 text-sm">
                        <tr>
                            <th className="border-x-2 border-black p-2">Reorder (auto fill)</th>
                            <th className="border-x-2 border-black p-2">Date</th>
                            <th className="border-x-2 border-black p-2">Item Name</th>
                            <th className="border-x-2 border-black p-2">Brand</th>
                            <th className="border-x-2 border-black p-2">Description</th>
                            <th className="border-x-2 border-black p-2">Purchase Quantity</th>
                            <th className="border-x-2 border-black p-2">Cost Per Item</th>
                            <th className="border-x-2 border-black p-2">Total Purchase Value</th>
                        </tr>
                    </thead>
                    <tbody>

                    </tbody>
                </table>
            </section>
        </div>
    )
}