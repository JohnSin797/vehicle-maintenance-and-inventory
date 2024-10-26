import { Schema, models, model } from "mongoose";

interface IInventory extends Document {
    item_name: string;
    deletedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

const inventorySchema = new Schema<IInventory>(
    {
        item_name: {
            type: String,
            required: true,
        },
        deletedAt: String,
    },
    {
        timestamps: true,
    }
)

const Inventory = models.Inventory || model('Inventory', inventorySchema);

export default Inventory;