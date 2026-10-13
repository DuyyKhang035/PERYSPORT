import mongoose from 'mongoose';

const AdminSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      default: 'Administrator',
    },
    email: {
      type: String,
      default: 'admin@perysport.vn',
    },
    role: {
      type: String,
      default: 'superadmin',
    },
  },
  { timestamps: true }
);

export default mongoose.models.Admin || mongoose.model('Admin', AdminSchema);
