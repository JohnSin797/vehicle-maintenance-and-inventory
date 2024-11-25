import connect from "@/lib/db";
import User from "@/lib/modals/users";
import Notification from "@/lib/modals/notifications";
import { NextResponse } from "next/server";
import { Types } from "mongoose";
import bcryptjs from "bcryptjs";
import { createSigner } from "fast-jwt";

export const GET = async (request: Request) => {
    try {
        const { searchParams } = new URL(request.url);
        const email = searchParams.get('email');
        if (!email) {
            return new NextResponse(JSON.stringify({message: 'Missing user email'}), {status: 400});
        }
        
        await connect();
        const user = await User.findOne({ email: email });
        if (!user) {
            return new NextResponse(JSON.stringify({message: 'Invalid user email'}), {status: 400});
        }
        return new NextResponse(JSON.stringify({message: 'OK', user: user}), {status: 200});
    } catch (error: unknown) {
        let message = '';
        if (error instanceof Error) {
            message = error.message
        }
        return new NextResponse('ERROR: ' + message, {status: 500});
    }
}

export const POST = async (request: Request) => {
    try {
        const { user_id, email, password, password_recovery_question, password_recovery_answer } = await request.json();
        await connect();
        if (password!='') {
            const salt = await bcryptjs.genSalt(10);
            const hashedPassword = await bcryptjs.hash(password, salt);
            const result = await User.findOneAndUpdate(
                { _id: user_id },
                {
                    email: email,
                    password: hashedPassword,
                    password_recovery_question: password_recovery_question,
                    password_recovery_answer: password_recovery_answer,
                },
                { new: true }
            );
            if (!result) {
                return new NextResponse(JSON.stringify({message: 'Failed to update account'}), {status: 400});
            }
            const notification = {
                user: user_id,
                message: 'You have updated your account'
            };
            await Notification.create(notification);
            return new NextResponse(JSON.stringify({message: 'OK'}), {status: 200});
        }
        const result = await User.findOneAndUpdate(
            { _id: user_id },
            {
                email: email,
                password_recovery_question: password_recovery_question,
                password_recovery_answer: password_recovery_answer,
            },
            { new: true }
        );
        if (!result) {
            return new NextResponse(JSON.stringify({message: 'Failed to update account'}), {status: 400});
        }
        const notification = {
            user: user_id,
            message: 'You have updated your account'
        };
        await Notification.create(notification);
        return new NextResponse(JSON.stringify({message: 'OK'}), {status: 200});
    } catch (error: unknown) {
        let message = '';
        if (error instanceof Error) {
            message = error.message
        }
        return new NextResponse('ERROR: ' + message, {status: 500});
    }
}

export const PATCH = async (request: Request) => {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('user_id');
        const body = await request.json();

        if (!userId) {
            return new NextResponse(JSON.stringify({message: 'Missing user id'}), {status: 400});
        }

        if (!Types.ObjectId.isValid(userId)) {
            return new NextResponse(JSON.stringify({message: 'Invalid user id'}), {status: 400});
        }

        await connect();
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(body?.password, salt);
        const user = await User.findOneAndUpdate(
            { _id: userId },
            { password: hashedPassword },
            { new: true }
        );
        if (!user) {
            return new NextResponse(JSON.stringify({message: 'Failed to update user'}), {status: 400});
        }
        
        const tokenData = {
            id: user._id,
            email: user.email,
            position: user.position,
        }
        const signer = createSigner({ key: process.env.SECRET_KEY });
        const token = signer(tokenData);
        const response = NextResponse.json({
            message: 'OK',
            user: user
        });
        const now = new Date();
        const notification = {
            user: user?._id,
            message: `You have successfully changed your password.`,
        }
        await Notification.create(notification);
        now.setMinutes(now.getMinutes() + 60);
        response.cookies.set('token', token, { httpOnly: true, expires: now });
        return response;
    } catch (error: unknown) {
        let message = '';
        if (error instanceof Error) {
            message = error.message
        }
        return new NextResponse('ERROR: ' + message, {status: 500});
    }
}