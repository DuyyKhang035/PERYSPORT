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

const newCategories = [
  {
    name: 'Giày Cầu Lông',
    slug: 'giay-cau-long',
    description: 'Giày chuyên dụng cho môn cầu lông',
    image: '',
    isActive: true,
    displayOrder: 10,
  },
  {
    name: 'Giày Tennis',
    slug: 'giay-tennis',
    description: 'Giày chuyên dụng cho môn tennis',
    image: '',
    isActive: true,
    displayOrder: 11,
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI, { dbName: 'pery_sport' });
    console.log('✅ Connected to MongoDB:', MONGODB_URI);

    for (const cat of newCategories) {
      const existing = await Category.findOne({ slug: cat.slug });
      if (existing) {
        console.log(`⚠️  Đã tồn tại: ${cat.name} (slug: ${cat.slug})`);
      } else {
        await Category.create(cat);
        console.log(`✅ Đã thêm: ${cat.name}`);
      }
    }

    // Hiển thị danh sách hiện tại
    const all = await Category.find({}).sort({ displayOrder: 1, name: 1 });
    console.log('\n📋 Danh mục hiện tại:');
    all.forEach((c) => console.log(`  [${c.isActive ? '✓' : '✗'}] ${c.name} (${c.slug})`));

  } catch (err) {
    console.error('❌ Lỗi:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected.');
  }
}

seed();
