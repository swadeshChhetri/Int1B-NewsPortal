import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema({
name: { type: String, required: true, trim: true },
email: { type: String, required: true, unique: true, lowercase: true },
passwordHash: { type: String, required: true, minlength: 6 }
}, { timestamps: true });


const Admin  = mongoose.model('Admin', AdminSchema);
export default Admin;