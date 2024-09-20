import connect from "@/lib/db"
import User from "@/lib/modals/users";
import { NextResponse } from "next/server"
import { Types } from "mongoose";

const ObjectId = require("mongoose").Types.ObjectId;

export const GET = async () => {
    try {
        await connect();
        const users = await User.find();
        return new NextResponse(JSON.stringify(users), {status: 200});
    } catch (error: any) {
        return new NextResponse('ERROR: ' + error?.message, {status: 500});
    }
}

export const POST = async (request: Request) => {
    try {
        const body = await request.json();
        await connect();
        const newUser = new User(body);
        await newUser.save();

        return new NextResponse(JSON.stringify({message: 'New user created', user: newUser}), {status: 200});
    } catch (error: any) {
        return new NextResponse('ERROR: ' + error?.message, {status: 500});
    }
}

export const PATCH = async (request: Request) => {
    try {
        const body = await request.json();
        const {userId, newEmail} = body;

        await connect();
        if (!userId || !newEmail) {
            return new NextResponse(JSON.stringify({message: 'User not found'}), {status: 400});
        }
        if (!Types.ObjectId.isValid(userId)) {
            return new NextResponse(JSON.stringify({message: 'Invalid user id'}), {status: 400});
        }
        const updateUser = await User.findOneAndUpdate(
            { _id: new ObjectId(userId) },
            { email: newEmail },
            { new: true }
        );
        if (!updateUser) {
            return new NextResponse(JSON.stringify({message: 'User update failed'}), {status: 400});
        }
        return new NextResponse(JSON.stringify({message: 'User is updated'}), {status: 200});
    } catch (error: any) {
        return new NextResponse('ERROR: ' + error?.message, {status: 500});
    }
}

export const DELETE = async (request: Request) => {
    try {
        const {searchParams} = new URL(request.url);
        const userId = searchParams.get('userId');
        
        if (!userId) {
            return new NextResponse(JSON.stringify({message: 'User not found'}), {status: 400});
        }
        if (!Types.ObjectId.isValid(userId)) {
            return new NextResponse(JSON.stringify({message: 'Invalid user id'}), {status: 400});
        }
        
        await connect();
        const deleteUser = await User.findByIdAndDelete(
            new Types.ObjectId(userId)
        );

        if (!deleteUser) {
            return new NextResponse(JSON.stringify({message: 'Failed to delete user'}), {status: 400});
        }

        return new NextResponse(JSON.stringify({message: 'User deleted successfully'}), {status: 200});
    } catch (error: any) {
        return new NextResponse('ERROR: ' + error?.message, {status: 500});
    }
}