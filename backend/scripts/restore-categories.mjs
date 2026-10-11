import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/pery_sport';

async function restore() {
  await mongoose.connect(MONGODB_URI, { dbName: 'pery_sport' });
  const col = mongoose.connection.collection('categories');

  const fixes = [
    { slug: 'chay-bo',             name: 'Chạy Bộ' },
    { slug: 'tap-gym',             name: 'Tập Gym' },
    { slug: 'di-bo',               name: 'Đi Bộ' },
    { slug: 'bong-ro',             name: 'Bóng Rổ' },
    { slug: 'thoi-trang-the-thao', name: 'Thời Trang Thể Thao' },
    { slug: 'giay-cau-long',       name: 'Giày Cầu Lông' },
  ];

  for (const f of fixes) {
    const r = await col.updateOne({ slug: f.slug }, { $set: { name: f.name } });
    console.log(r.modifiedCount ? `✅ ${f.name}` : `⚠️  Không tìm thấy: ${f.slug}`);
  }

  const all = await col.find({}).sort({ displayOrder: 1 }).toArray();
  console.log('\n📋 Danh mục sau khi khôi phục:');
  all.forEach(c => console.log(`  ${c.name} (${c.slug})`));

  await mongoose.disconnect();
}

restore().catch(console.error);
