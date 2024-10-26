import connect from "@/lib/db";
import Product from "@/lib/modals/products";
import Supplier from "@/lib/modals/suppliers";
import Inventory from "@/lib/modals/inventory";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

export const GET = async () => {
    try {
        await connect();
        const products = await Product.find({ deletedAt: null });
        const suppliers = await Supplier.find({ deletedAt: null });
        const inventory = await Inventory.find({ deletedAt: null });
        return new NextResponse(JSON.stringify({message: 'OK', products: products, suppliers: suppliers, inventory: inventory}), {status: 200});
    } catch (error: unknown) {
        let message = '';
        if (error instanceof Error) {
            message = error.message;
        }
        return new NextResponse('ERROR: ' + message, {status:500});
    }
}

export const POST = async (request: Request) => {
    try {
        const body = await request.json();
        await connect();

        const product = await Product.create(body);
        if (!product) {
            return new NextResponse(JSON.stringify({message: 'Failed to create product'}), {status: 400});
        }
        return new NextResponse(JSON.stringify({message: 'Product created'}), {status: 200});
    } catch (error: unknown) {
        let message = '';
        if (error instanceof Error) {
            message = error.message;
        }
        return new NextResponse('ERROR: ' + message, {status:500});
    }
}

export const PATCH = async (request: Request) => {
    try {
        const { searchParams } = new URL(request.url);
        const productId = searchParams.get('product_id');

        if (!productId) {
            return new NextResponse(JSON.stringify({message: 'Product id not found'}), {status: 400});
        }

        if (!Types.ObjectId.isValid(productId)) {
            return new NextResponse(JSON.stringify({message: 'Invalid product id'}), {status: 400});
        }

        const result = await Product.findOneAndUpdate(
            { _id: new Types.ObjectId(productId) },
            { deletedAt: new Date() },
            { new: true }
        );

        if (!result) {
            return new NextResponse(JSON.stringify({message: 'Failed to delete product'}), {status: 400});
        }
        
        const products = await Product.find({ deletedAt: null });
        return new NextResponse(JSON.stringify({message: 'OK', products: products}), {status: 200});
    } catch (error: unknown) {
        let message = '';
        if (error instanceof Error) {
            message = error.message;
        }
        return new NextResponse('ERROR: ' + message, {status:500});
    }
}