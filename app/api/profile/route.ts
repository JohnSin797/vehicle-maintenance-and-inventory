import connect from "@/lib/db";
import User from "@/lib/modals/users";
import { Types } from "mongoose";
import { NextResponse } from "next/server";
import bcryptjs from "bcryptjs";

export const PUT = async (request: Request) => {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('user_id');

        if (!userId) {
            return new NextResponse(JSON.stringify({message: 'Missing user id'}), {status: 400});
        }

        if (!Types.ObjectId.isValid(userId)) {
            return new NextResponse(JSON.stringify({message: 'Invalid user id'}), {status: 400});
        }

        const body = await request.json();
        await connect();

        const newUser = await User.findOneAndUpdate(
            { _id: new Types.ObjectId(userId) },
            body,
            { new: true }
        );

        if (!newUser) {
            return new NextResponse(JSON.stringify({message: 'Update failed'}), {status: 400});
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

export const PATCH = async (request: Request) => {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('user_id');

        if (!userId) {
            return new NextResponse(JSON.stringify({message: 'Missing user id'}), {status: 400});
        }
        
        if (!Types.ObjectId.isValid(userId)) {
            return new NextResponse(JSON.stringify({message: 'Invalid user id'}), {status: 400});
        }

        const { password } = await request.json();
        await connect();

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        const result = await User.findOneAndUpdate(
            { _id: new Types.ObjectId(userId) },
            { password: hashedPassword },
            { new: true }
        );

        if (!result) {
            return new NextResponse(JSON.stringify({message: 'Failed to change password'}), {status: 400});
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