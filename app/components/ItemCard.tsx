'use client'

import Link from "next/link";
import { FC } from "react";

interface ItemCardProps {
    title: string;
    path: string;
}

const ItemCard: FC<ItemCardProps> = ({ title, path }) => {
    return (
        <Link 
            href={path} 
            className="block rounded w-full md:w-1/6 h-10 flex justify-center items-center bg-white hover:bg-indigo-900 hover:text-white font-bold"
        >
            {title}
        </Link>
    )
}

export default ItemCard