import connect from "@/lib/db";
import DriverReport from "@/lib/modals/driver_reports";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

export const GET = async () => {
    try {
        await connect();
        const reports = await DriverReport.find({ deletedAt: { $ne: null } }).populate('report');
        return new NextResponse(JSON.stringify({message: 'OK', reports: reports}), {status: 200});
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
        const result = await DriverReport.findOneAndUpdate(
            { _id: reportId },
            { deletedAt: null },
            { new: true }
        );
        if (!result) {
            return new NextResponse(JSON.stringify({message: 'Failed to restore report'}), {status: 400});
        }
        const reports = await DriverReport.find({ deletedAt: { $ne: null } }).populate('report');
        return new NextResponse(JSON.stringify({message: 'OK', reports: reports}), {status: 200});
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
        const result = await DriverReport.findByIdAndDelete(reportId);
        
        if (!result) {
            return new NextResponse(JSON.stringify({message: 'Failed to delete report'}), {status: 400});
        }
        const reports = await DriverReport.find({ deletedAt: { $ne: null } }).populate('report');
        return new NextResponse(JSON.stringify({message: 'OK', reports: reports}), {status: 200});
    } catch (error: unknown) {
        let message = '';
        if (error instanceof Error) {
            message = error.message;
        }
        return new NextResponse('Error: ' + message, {status: 500});
    }
}