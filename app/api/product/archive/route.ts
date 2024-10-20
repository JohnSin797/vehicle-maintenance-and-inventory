import connect from "@/lib/db";
import Product from "@/lib/modals/products";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

export const GET = async () => {
    try {
        await connect();
        const products = await Product.find({ deletedAt: { $ne: null } });
        return new NextResponse(JSON.stringify({message: 'OK', products: products}), {status: 200});
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
            return new NextResponse(JSON.stringify({message: 'Failed to create product'}), {status: 400});
        }

        if (!Types.ObjectId.isValid(productId)) {
            return new NextResponse(JSON.stringify({message: 'Invalid product id'}), {status: 400});
        }

        await connect();
        const result = await Product.findOneAndUpdate(
            { _id: new Types.ObjectId(productId) },
            { deletedAt: null },
            { new: true }
        );

        if (!result) {
            return new NextResponse(JSON.stringify({message: 'Failed to restore product'}), {status: 400});
        }

        const products = await Product.find({ deletedAt: { $ne: null } });
        return new NextResponse(JSON.stringify({message: 'OK', products: products}), {status: 200});
    } catch (error: unknown) {
        let message = '';
        if (error instanceof Error) {
            message = error.message;
        }
        return new NextResponse('ERROR: ' + message, {status:500});
    }
}

export const DELETE = async (request: Request) => {
    try {
        const { searchParams } = new URL(request.url);
        const productId = searchParams.get('product_id');

        if (!productId) {
            return new NextResponse(JSON.stringify({message: 'Failed to create product'}), {status: 400});
        }

        if (!Types.ObjectId.isValid(productId)) {
            return new NextResponse(JSON.stringify({message: 'Invalid product id'}), {status: 400});
        }

        await connect();
        const result = await Product.findByIdAndDelete(productId);

        if (!result) {
            return new NextResponse(JSON.stringify({message: 'Failed to delete product'}), {status: 400});
        }

        const products = await Product.find({ deletedAt: { $ne: null } });
        return new NextResponse(JSON.stringify({message: 'OK', products: products}), {status: 200});
    } catch (error: unknown) {
        let message = '';
        if (error instanceof Error) {
            message = error.message;
        }
        return new NextResponse('ERROR: ' + message, {status:500});
    }
}