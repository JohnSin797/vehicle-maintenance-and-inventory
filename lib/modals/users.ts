import { Schema, model, models } from "mongoose";

const userSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        first_name: {
            type: String,
            required: true,
        },
        middle_name: {
            type: String,
            required: true,
        },
        last_name: {
            type: String,
            required: true,
        },
        extension: {
            type: String,
        },
        role: {
            type: String,
            default: 'user',
        },
        position: {
            type: String,
            required: true,
        }
    },
    {
        timestamps: true,
    }
)

const User = models.User || model("User", userSchema);

export default User;