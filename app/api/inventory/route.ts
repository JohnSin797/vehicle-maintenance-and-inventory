import connect from "@/lib/db";
import Inventory from "@/lib/modals/inventory";
import PurchaseOrder from "@/lib/modals/purchase_orders";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

export const GET = async (request: Request) => {
    try {
        const { searchParams } = new URL(request.url);
        const inventoryId = searchParams.get('inventory_id');
        await connect();
        if (inventoryId) {
            if (!Types.ObjectId.isValid(inventoryId)) {
                return new NextResponse(JSON.stringify({ message: 'Invalid inventory id' }), { status: 400 });
            }
            const inventory = await Inventory.findOne({ deletedAt: null, _id: inventoryId });
            const po = await PurchaseOrder.find({ deletedAt: null, inventory: inventoryId }).populate('inventory');
            return new NextResponse(JSON.stringify({message: 'OK', inventory: inventory, orders: po}), {status: 200});
        }
        const inventory = await Inventory.find({ deletedAt: null });
        return new NextResponse(JSON.stringify({message: 'OK', inventory: inventory}), {status: 200});
    } catch (error: unknown) {
        let message = '';
        if (error instanceof Error) {
            message = error.message;
        }
        return new NextResponse('Error: ' + message, {status: 500});
    }
}

export const POST = async (request: Request) => {
    try {
        const { item_name } = await request.json();
        if (!item_name || typeof item_name !== 'string' || item_name.trim().length === 0) {
            return new NextResponse(JSON.stringify({ message: 'Invalid item name' }), { status: 400 });
        }
        await connect();
        const result = await Inventory.create({ item_name: item_name.trim().toUpperCase() });
        if (!result) {
            return new NextResponse(JSON.stringify({message: 'Failed to create inventory item'}), {status: 400});
        }
        return new NextResponse(JSON.stringify({message: 'OK'}), {status: 200});
    } catch (error: unknown) {
        let message = '';
        if (error instanceof Error) {
            message = error.message;
        }
        return new NextResponse('Error: ' + message, {status: 500});
    }
}