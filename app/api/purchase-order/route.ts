import connect from "@/lib/db";
import PurchaseOrder from "@/lib/modals/purchase_orders";
import { NextResponse } from "next/server";

export const GET = async () => {
    try {
        await connect();
        const orders = await PurchaseOrder.find({ deletedAt: null }).populate('inventory').populate('supplier');
        return new NextResponse(JSON.stringify({message: 'OK', orders: orders}), {status: 200});
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

        const result = await PurchaseOrder.create(body);
        if (!result) {
            return new NextResponse(JSON.stringify({message: 'Failed to create purchase order'}), {status: 400});
        }

        return new NextResponse(JSON.stringify({message: 'OK'}), {status: 200});
    } catch (error: unknown) {
        let message = '';
        if (error instanceof Error) {
            message = error.message;
        }
        return new NextResponse('ERROR: ' + message, {status:500});
    }
}