import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/pery_sport';

const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, default: '' },
    image: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Category = mongoose.models?.Category || mongoose.model('Category', CategorySchema);

// Mapping: slug cũ => tên mới
const renames = [
  { slug: 'chay-bo',              newName: 'Đã xác nhận' },
  { slug: 'tap-gym',              newName: 'Đang chuẩn bị hàng' },
  { slug: 'di-bo',                newName: 'Đang giao hàng' },
  { slug: 'bong-ro',              newName: 'Đã giao hàng' },
  { slug: 'thoi-trang-the-thao',  newName: 'Đã hoàn thành' },
  { slug: 'giay-cau-long',        newName: 'Đã Hủy' },
];

async function renameCategories() {
  try {
    await mongoose.connect(MONGODB_URI, { dbName: 'pery_sport' });
    console.log('✅ Connected to MongoDB');

    for (const { slug, newName } of renames) {
      const result = await Category.findOneAndUpdate(
        { slug },
        { $set: { name: newName } },
        { new: true }
      );
      if (result) {
        console.log(`✅ Đổi tên: "${slug}" → "${newName}"`);
      } else {
        console.log(`⚠️  Không tìm thấy category slug: "${slug}"`);
      }
    }

    // Hiển thị danh sách sau khi đổi
    const all = await Category.find({}).sort({ displayOrder: 1, name: 1 });
    console.log('\n📋 Danh mục sau khi cập nhật:');
    all.forEach((c) => console.log(`  [${c.isActive ? '✓' : '✗'}] ${c.name} (${c.slug})`));

  } catch (err) {
    console.error('❌ Lỗi:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected.');
  }
}

renameCategories();
