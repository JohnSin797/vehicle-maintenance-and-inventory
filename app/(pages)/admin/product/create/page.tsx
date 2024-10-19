'use client'

import Header from "@/app/components/Header"
import { ChangeEvent, FormEvent, useState } from "react";
import { IoIosAdd } from "react-icons/io";
import { FaTrash } from "react-icons/fa";
import axios from "axios";

interface Product {
    item_name: string;
    brand: string;
    description: string[];
}

export default function Create() {
    const [product, setProduct] = useState<Product>({
        item_name: '',
        brand: '',
        description: [''],
    })

    const addItem = () => {
        const temp = [...product.description]
        temp.push('')
        setProduct({
            ...product,
            description: temp
        })
    }

    const deleteItem = (index: number) => {
        const temp = [...product.description]
        temp.splice(index, 1)
        setProduct({
            ...product,
            description: temp
        })
    }

    const descriptionOnChange = (event: ChangeEvent<HTMLInputElement>, index: number) => {
        const temp = [...product.description]
        temp[index] = event.target.value
        setProduct({
            ...product,
            description: temp
        })
    }

    const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target
        setProduct({
            ...product,
            [name]: value
        })
    }

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault()
        await axios.post('/api/product', product)
        .then(() => {
            setProduct({
                item_name: '',
                brand: '',
                description: ['']
            })
        })
        .catch(error => {
            console.log(error)
        })
    }

    return (
        <div className="w-full">
            <Header title="CREATE PRODUCT" backTo={'/admin/product'} />
            <section className="w-full">
                <form onSubmit={handleSubmit} className="w-full flex justify-center items-center">
                    <div className="w-96 flex flex-col justify-center items-center">
                        <div className="w-full">
                            <label htmlFor="item_name" className="text-xs text-amber-200 font-bold">Item Name:</label>
                            <input 
                                type="text" 
                                name="item_name" 
                                id="item_name" 
                                className="w-full p-2 outline-none" 
                                value={product.item_name}
                                onChange={handleOnChange}
                            />
                        </div>
                        <div className="w-full">
                            <label htmlFor="brand" className="text-xs text-amber-200 font-bold">Brand:</label>
                            <input 
                                type="text" 
                                name="brand" 
                                id="brand" 
                                className="w-full p-2 outline-none" 
                                value={product.brand}
                                onChange={handleOnChange}
                            />
                        </div>
                        <div className="w-full">
                            <label className="text-xs text-amber-200 font-bold">Description:</label>
                            {
                                product.description.map((item,index) => {
                                    return(
                                        <div className="w-full flex justify-center items-center gap-2 mb-2" key={index}>
                                            <input 
                                                type="text" 
                                                name={`description${index}`} 
                                                id={`description${index}`} 
                                                className="w-full p-2 outline-none" 
                                                value={item}
                                                onChange={(e)=>descriptionOnChange(e, index)}
                                            />
                                            {
                                                index === 0 ? (
                                                    <button type="button" onClick={addItem} className="p-2 text-white text-2xl font-bold bg-green-400 hover:bg-green-600">
                                                        <IoIosAdd />
                                                    </button>
                                                ) : (
                                                    <button type="button" onClick={()=>deleteItem(index)} className="p-2 text-white text-2xl font-bold bg-red-400 hover:bg-red-600">
                                                        <FaTrash />
                                                    </button>
                                                )
                                            }
                                        </div>
                                    )
                                })   
                            }
                        </div>
                        <button type="submit" className="w-full p-2 text-sm text-white font-bold bg-indigo-400 hover:bg-indigo-600">SAVE</button>
                    </div>
                </form>
            </section>
        </div>
    )
}