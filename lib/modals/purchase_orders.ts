import { Schema, model, models } from "mongoose";

interface IPurchaseOrder extends Document {
    product: Schema.Types.ObjectId;
    supplier: Schema.Types.ObjectId;
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
        product: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        supplier: {
            type: Schema.Types.ObjectId,
            ref: 'Supplier',
            required: true,
        },
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