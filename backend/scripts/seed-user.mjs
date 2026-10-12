import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/pery_sport';

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  fullName: { type: String, default: '' },
  phone: { type: String, default: '' },
  address: { type: String, default: '' },
  dateOfBirth: { type: String, default: '' },
  gender: { type: String, default: '' },
  avatar: { type: String, default: '' },
  role: { type: String, default: 'user' },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function seed() {
  await mongoose.connect(MONGODB_URI, { dbName: 'pery_sport' });

  const testUsers = [
    {
      email: 'khachhang@perysport.vn',
      password: '123456',
      fullName: 'Nguyễn Văn Khách',
      phone: '0901234567',
      address: '123 Đường Thể Thao, Quận 1, TP.HCM',
      gender: 'male',
      role: 'user',
    },
    {
      email: 'khachhang2@perysport.vn',
      password: '123456',
      fullName: 'Trần Thị Lan',
      phone: '0912345678',
      address: '456 Đường Nguyễn Huệ, Quận 1, TP.HCM',
      gender: 'female',
      role: 'user',
    },
  ];

  for (const u of testUsers) {
    const existing = await User.findOne({ email: u.email });
    if (existing) {
      console.log(`⚠️  Đã tồn tại: ${u.email}`);
      continue;
    }
    const hashed = await bcrypt.hash(u.password, 10);
    await User.create({ ...u, password: hashed });
    console.log(`✅ Tạo user: ${u.email} | mật khẩu: ${u.password}`);
  }

  console.log('\n📋 Tài khoản test:');
  console.log('  👤 Email: khachhang@perysport.vn | Mật khẩu: 123456');
  console.log('  👤 Email: khachhang2@perysport.vn | Mật khẩu: 123456');
  console.log('  🔑 Admin: username=admin | Mật khẩu: 123 (hiện có)');

  await mongoose.disconnect();
}

seed().catch(console.error);
