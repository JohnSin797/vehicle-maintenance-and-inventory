import { Schema, model, models } from "mongoose";

interface IDriverReport extends Document {
    bus_number: string;
    driver: Schema.Types.ObjectId;
    conductor: string;
    report: Schema.Types.ObjectId[];
    status: string;
    deletedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

const driverReportSchema = new Schema<IDriverReport>(
    {
        bus_number: {
            type: String,
            required: true,
        },
        driver: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        conductor: {
            type: String,
            required: true,
        },
        report: {
            type: [Schema.Types.ObjectId],
            ref: 'Inventory',
            required: true,
        },
        status: {
            type: String,
            default: 'pending',
        },
        deletedAt: Date,
    },
    {
        timestamps: true
    }
)

const DriverReport = models.DriverReport || model('DriverReport', driverReportSchema);

export default DriverReport;