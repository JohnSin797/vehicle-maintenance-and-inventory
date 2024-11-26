import connect from "@/lib/db";
import InventoryReport from "@/lib/modals/inventory_reports";
import Notification from "@/lib/modals/notifications";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

export const GET = async () => {
    try {
        await connect();
        const archive = await InventoryReport.find({ deletedAt: { $ne: null } }).populate('inventory').populate('item_type').populate('driver');
        return new NextResponse(JSON.stringify(JSON.stringify({message: 'OK', archive: archive})), {status: 200});
    } catch (error: unknown) {
        let message = '';
        if (error instanceof Error) {
            message = error.message;
        }
        return new NextResponse('Error: ' + message, {status: 500});
    }
}

export const PATCH = async (request: Request) => {
    try {
        const { searchParams } = new URL(request.url);
        const reportId = searchParams.get('report_id');
        const userId = searchParams.get('user_id');
        if (!reportId) {
            return new NextResponse(JSON.stringify({message: 'Missing report id'}), {status: 400});
        }
        
        if (!Types.ObjectId.isValid(reportId)) {
            return new NextResponse(JSON.stringify({message: 'Invalid report id'}), {status: 400});
        }
        await connect();
        const result = await InventoryReport.findOneAndUpdate(
            { _id: reportId },
            { deletedAt: null },
            { new: true }
        );
        if (!result) {
            return new NextResponse(JSON.stringify({message: 'Failed to restore report'}), {status: 400});
        }
        const notification = {
            user: userId,
            message: 'You have restored a report'
        }
        await Notification.create(notification);
        const archive = await InventoryReport.find({ deletedAt: { $ne: null } }).populate('inventory').populate('item_type').populate('driver');
        return new NextResponse(JSON.stringify(JSON.stringify({message: 'OK', archive: archive})), {status: 200});
    } catch (error: unknown) {
        let message = '';
        if (error instanceof Error) {
            message = error.message;
        }
        return new NextResponse('Error: ' + message, {status: 500});
    }
}

export const DELETE = async (request: Request) => {
    try {
        const { searchParams } = new URL(request.url);
        const reportId = searchParams.get('report_id');
        const userId = searchParams.get('user_id');
        if (!reportId) {
            return new NextResponse(JSON.stringify({message: 'Missing report id'}), {status: 400});
        }
        
        if (!Types.ObjectId.isValid(reportId)) {
            return new NextResponse(JSON.stringify({message: 'Invalid report id'}), {status: 400});
        }
        await connect();
        const result = await InventoryReport.findByIdAndDelete(reportId);
        if (!result) {
            return new NextResponse(JSON.stringify({message: 'Failed to restore report'}), {status: 400});
        }
        const notification = {
            user: userId,
            message: 'You have permanently deleted a report'
        }
        await Notification.create(notification);
        const archive = await InventoryReport.find({ deletedAt: { $ne: null } }).populate('inventory').populate('item_type').populate('driver');
        return new NextResponse(JSON.stringify(JSON.stringify({message: 'OK', archive: archive})), {status: 200});
    } catch (error: unknown) {
        let message = '';
        if (error instanceof Error) {
            message = error.message;
        }
        return new NextResponse('Error: ' + message, {status: 500});
    }
}