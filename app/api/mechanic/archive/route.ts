import MechanicReport from "@/lib/modals/mechanic_reports";
import connect from "@/lib/db";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

export const GET = async (request: Request) => {
    try {
        const { searchParams } = new URL(request.url);
        const mechID = searchParams.get('mech_id');

        if (!mechID) {
            return new NextResponse(JSON.stringify({message: 'Missing mechanic id'}), {status: 400});
        }

        if (!Types.ObjectId.isValid(mechID)) {
            return new NextResponse(JSON.stringify({message: 'Invalid mechanic id'}), {status: 400});
        }

        await connect();
        const archive = await MechanicReport.find({ mechanic: mechID, deletedAt: { $ne: null } }).populate('driver').populate('report');
        return new NextResponse(JSON.stringify({message: 'OK', archive: archive}), {status: 200});
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
        if (!reportId) {
            return new NextResponse(JSON.stringify({message: 'Missing report id'}), {status: 400});
        }
        
        if (!Types.ObjectId.isValid(reportId)) {
            return new NextResponse(JSON.stringify({message: 'Invalid report id'}), {status: 400});
        }

        await connect();
        const result = await MechanicReport.findOneAndUpdate(
            { _id: new Types.ObjectId(reportId) },
            { deletedAt: null },
            { new: true }
        )
        if (!result) {
            return new NextResponse(JSON.stringify({message: 'Failed to restore report'}), {status: 400});
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

export const DELETE = async (request: Request) => {
    try {
        const { searchParams } = new URL(request.url);
        const reportId = searchParams.get('report_id');
        if (!reportId) {
            return new NextResponse(JSON.stringify({message: 'Missing report id'}), {status: 400});
        }
        
        if (!Types.ObjectId.isValid(reportId)) {
            return new NextResponse(JSON.stringify({message: 'Invalid report id'}), {status: 400});
        }

        await connect();
        const result = await MechanicReport.findByIdAndDelete(reportId);
        
        if (!result) {
            return new NextResponse(JSON.stringify({message: 'Failed to delete report'}), {status: 400});
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