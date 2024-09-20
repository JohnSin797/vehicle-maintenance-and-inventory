import connect from "@/lib/db";
import User from "@/lib/modals/users";
import * as argon2 from "argon2";
import { Types } from "mongoose";
import { NextResponse } from "next/server";
import { createSigner } from "fast-jwt";

const ObjectId = Types.ObjectId;

export const GET = async (request: Request) => {
    try {
        const response = NextResponse.json({message: 'OK'}, {status: 200});
        response.cookies.set('token', '', { httpOnly: true, expires: new Date(0) });
        return response;
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
        const {email, password} = await request.json();
        await connect();
        const user = await User.findOne({ email: email });
        if (!user) {
            return new NextResponse(JSON.stringify({message: 'Invalid email'}), {status: 401});
        }
        if (!await argon2.verify(user?.password, password)) {
            return new NextResponse(JSON.stringify({message: 'Wrong password'}), {status: 401});
        }
        const tokenData = {
            id: user._id,
            email: user.email,
            position: user.position,
        }
        const signer = createSigner({ key: process.env.SECRET_KEY });
        const token = signer(tokenData);
        // return new NextResponse(JSON.stringify({message: 'OK', user: user}), {status: 200});
        const response = NextResponse.json({
            message: 'OK',
            user: user
        });
        const now = new Date();
        now.setMinutes(now.getMinutes() + 60);
        response.cookies.set('token', token, { httpOnly: true, expires: now });
        return response;
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
        const {id, password} = await request.json();
        if (!Types.ObjectId.isValid(id)) {
            return new NextResponse(JSON.stringify({message: 'Invalid user'}), {status: 400});
        }
        await connect();
        const hashedPassword = await argon2.hash(password);
        const updateUser = await User.findOneAndUpdate(
            { _id: new ObjectId(id) },
            { password: hashedPassword },
            { new: true }
        );
        if (!updateUser) {
            return new NextResponse(JSON.stringify({message: 'Update failed'}), {status: 400});
        }
        return new NextResponse(JSON.stringify({message: 'OK', user: updateUser.select('-password')}), {status: 200});
    } catch (error: unknown) {
        let message = '';
        if (error instanceof Error) {
            message = error.message;
        }
        return new NextResponse('ERROR: ' + message, {status:500});
    }
}