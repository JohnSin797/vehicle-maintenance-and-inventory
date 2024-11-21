import { Schema, model, models } from "mongoose";

interface IMechanicReport extends Document {
    mechanic: Schema.Types.ObjectId;
    bus_number: string;
    driver: Schema.Types.ObjectId;
    conductor: string;
    report: Schema.Types.ObjectId[];
    report_date: Date;
    status: string;
    deletedAt?: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

const mechanicReportSchema = new Schema<IMechanicReport>(
    {
        mechanic: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
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
        report_date: Date,
        deletedAt: Date,
    },
    {
        timestamps: true,
    }
)

const MechanicReport = models.MechanicReport || model('MechanicReport', mechanicReportSchema);

export default MechanicReport;