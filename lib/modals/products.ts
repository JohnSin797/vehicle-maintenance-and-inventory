import { Schema, model, models } from "mongoose";

interface IProduct extends Document {
    item_name: string;
    brand: string;
    description: string[];
    deletedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
    {
        item_name: {
            type: String,
            required: true,
        },
        brand: {
            type: String,
            required: true,
        },
        description: {
            type: [String],
            required: true,
            default: [''],
        },
        deletedAt: Date,
    },
    {
        timestamps: true,
    }
)

const Product = models.Product || model('Product', productSchema);

export default Product;