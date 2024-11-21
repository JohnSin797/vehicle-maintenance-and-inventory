import { Schema, models, model } from "mongoose";

interface IInventoryReport extends Document {
    inventory: Schema.Types.ObjectId;
    item_type: Schema.Types.ObjectId;
    quantity: number;
    recipient?: string;
    driver: Schema.Types.ObjectId;
    bus_number: string;
    deletedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const inventoryReportSchema = new Schema<IInventoryReport>(
    {
        inventory: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        item_type: {
            type: Schema.Types.ObjectId,
            ref: 'Inventory',
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
        recipient: String,
        driver: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        bus_number: {
            type: String,
            required: true,
        },
        deletedAt: Date,
    },
    {
        timestamps: true,
    }
)

const InventoryReport = models.InventoryReport || model('InventoryReport', inventoryReportSchema);

export default InventoryReport;