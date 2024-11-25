import connect from "@/lib/db";
import PurchaseOrder from "@/lib/modals/purchase_orders";
import Notification from "@/lib/modals/notifications";
import { NextResponse } from "next/server";
import { Types } from "mongoose";

export const GET = async () => {
    try {
        await connect();
        const archive = await PurchaseOrder.find({ deletedAt: { $ne: null } }).populate('inventory').populate('supplier');
        return new NextResponse(JSON.stringify({message: 'OK', archive: archive}), {status: 200});
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
        const orderId = searchParams.get('order_id');
        const { user_id } = await request.json();

        if (!orderId) {
            return new NextResponse(JSON.stringify({message: 'Missing purchase order id'}), {status: 400});
        }

        if (!Types.ObjectId.isValid(orderId)) {
            return new NextResponse(JSON.stringify({message: 'Invalid purchase order id'}), {status: 400});
        }
        await connect();
        
        const result = await PurchaseOrder.findOneAndUpdate(
            { _id: orderId },
            { deletedAt: null },
            { new: true }
        );
        if (!result) {
            return new NextResponse(JSON.stringify({message: 'Failed to restore purchase order'}), {status: 400});
        }
        const notification = {
            user: user_id,
            message: 'You have restored a purchase order'
        }
        await Notification.create(notification);
        const orders = await PurchaseOrder.find({ deletedAt: { $ne: null } }).populate('inventory').populate('supplier');
        return new NextResponse(JSON.stringify({message: 'OK', archive: orders}), {status: 200});
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
        const orderId = searchParams.get('order_id');
        const user_id = searchParams.get('user_id');

        if (!orderId) {
            return new NextResponse(JSON.stringify({message: 'Missing purchase order id'}), {status: 400});
        }

        if (!Types.ObjectId.isValid(orderId)) {
            return new NextResponse(JSON.stringify({message: 'Invalid purchase order id'}), {status: 400});
        }
        await connect();
        const result = await PurchaseOrder.findByIdAndDelete(orderId)
        if (!result) {
            return new NextResponse(JSON.stringify({message: 'Failed to delete purchase order'}), {status: 400});
        }
        const notification = {
            user: user_id,
            message: 'You have permanently deleted a purchase order'
        }
        await Notification.create(notification);
        const orders = await PurchaseOrder.find({ deletedAt: { $ne: null } }).populate('inventory').populate('supplier');
        return new NextResponse(JSON.stringify({message: 'OK', archive: orders}), {status: 200});
    } catch (error: unknown) {
        let message = '';
        if (error instanceof Error) {
            message = error.message;
        }
        return new NextResponse('ERROR: ' + message, {status:500});
    }
}