import { Schema, model, models } from "mongoose";

interface IPurchaseOrder extends Document {
    inventory: Schema.Types.ObjectId;
    supplier: Schema.Types.ObjectId;
    brand: string;
    description: string;
    date_ordered: Date;
    date_received: Date;
    unit_cost: number;
    quantity: number;
    total_price: number;
    status: string;
    deletedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

const purchaseOrderSchema = new Schema<IPurchaseOrder>(
    {
        inventory: {
            type: Schema.Types.ObjectId,
            ref: 'Inventory',
            required: true,
        },
        supplier: {
            type: Schema.Types.ObjectId,
            ref: 'Supplier',
            required: true,
        },
        brand: {
            type: String,
            required: true,
        },
        description: String,
        date_ordered: {
            type: Date,
            default: new Date(),
        },
        date_received: Date,
        unit_cost: {
            type: Number,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
        total_price: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            default: 'pending',
            required: true,
        },
        deletedAt: Date
    },
    {
        timestamps: true,
    }
)

const PurchaseOrder = models.PurchaseOrder || model('PurchaseOrder', purchaseOrderSchema);

export default PurchaseOrder;