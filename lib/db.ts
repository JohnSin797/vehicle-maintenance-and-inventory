import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

const connect = async () => {
    const connectionState = mongoose.connection.readyState;

    if (connectionState === 1) {
        console.log('connected to MONGODB');
        return;
    }

    if (connectionState === 2) {
        console.log('connecting...');
        return;
    }

    try {
        mongoose.connect(MONGODB_URI!, {
            dbName: 'vehicle-maintenance-and-inventory',
            bufferCommands: true,
        })
        console.log('connected');
    } catch (error: any) {
        console.log('ERROR: ', error?.message);
        throw new Error('ERROR: ', error?.message);
    }
}

export default connect;