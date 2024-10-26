import { Schema, model, models } from "mongoose";

interface IMechanicReport extends Document {
    mechanic: Schema.Types.ObjectId;
    bus_number: string;
    driver: string;
    conductor: string;
    report: string;
    report_date: Date;
    deletedAt?: Date;
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
            type: String,
            required: true,
        },
        conductor: {
            type: String,
            required: true,
        },
        report: {
            type: String,
            required: true,
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