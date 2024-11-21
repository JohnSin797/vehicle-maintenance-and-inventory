import connect from "@/lib/db";
import InventoryReport from "@/lib/modals/inventory_reports";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

export const GET = async (request: Request) => {
    try {
        const { searchParams } = new URL(request.url);
        const typeId = searchParams.get('type_id');
        if (!typeId) {
            return new NextResponse(JSON.stringify({message: 'Missing type id'}), {status: 400});
        }
        
        if (!Types.ObjectId.isValid(typeId)) {
            return new NextResponse(JSON.stringify({message: 'Invalid type id'}), {status: 400});
        }

        await connect();
        const reports = await InventoryReport.find({ item_type: typeId, deletedAt: null }).populate('item_type').populate('driver');
        return new NextResponse(JSON.stringify({message: 'OK', reports: reports}), {status: 200});
    } catch (error: unknown) {
        let message = '';
        if (error instanceof Error) {
            message = error.message;
        }
        return new NextResponse('Error: ' + message, {status: 500});
    }
}