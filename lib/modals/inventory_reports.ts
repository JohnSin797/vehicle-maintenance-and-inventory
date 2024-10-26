import { Schema, models, model } from "mongoose";

interface IInventoryReport extends Document {
    inventory: Schema.Types.ObjectId;
    item_type: string;
    quantity: number;
    recipient: string;
    driver: string;
    deletedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

const inventoryReportSchema = new Schema<IInventoryReport>(
    {
        inventory: {
            type: Schema.Types.ObjectId,
            ref: 'Inventory',
            required: true,
        },
        item_type: {
            type: String,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
        recipient: {
            type: String,
            required: true,
        },
        driver: {
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