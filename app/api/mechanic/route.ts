import connect from "@/lib/db";
import MechanicReport from "@/lib/modals/mechanic_reports";
import Notification from "@/lib/modals/notifications";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

export const GET = async () => {
    try {
        await connect();
        const reports = await MechanicReport.find({ deletedAt: null }).populate('mechanic');
        return new NextResponse(JSON.stringify({message: 'OK', reports: reports}), {status: 200});
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
        const body = await request.json();
        const result = await MechanicReport.create(body);
        if (!result) {
            return new NextResponse(JSON.stringify({message: 'Failed to create mechanic report'}), {status: 400});
        }
        await Notification.create(
            {
                user: new Types.ObjectId(body?.mechanic),
                message: 'You have submitted a report',
            }
        )
        return new NextResponse(JSON.stringify({message: 'OK'}), {status: 200});
    } catch (error: unknown) {
        let message = '';
        if (error instanceof Error) {
            message = error.message;
        }
        return new NextResponse('Error: ' + message, {status: 500});
    }
}