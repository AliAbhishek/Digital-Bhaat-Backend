import mongoose, { Document } from "mongoose";



export interface IAdmin extends Document {
    name: string;
    email: string;
    password: string;

}

const AdminSchema = new mongoose.Schema<IAdmin>(
    {
        name: { type: String, default: null },
        email: { type: String, required: true },
        password: { type: String, required: true }
    }, { timestamps: true }
)

export default mongoose.model<IAdmin>('Admin', AdminSchema);