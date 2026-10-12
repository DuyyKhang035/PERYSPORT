import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/pery_sport';

async function fixHotDeals() {
  await mongoose.connect(MONGODB_URI, { dbName: 'pery_sport' });

  const promos = await mongoose.connection.collection('promotions').find({}).toArray();
  console.log('=== Promotions hiện có ===');
  promos.forEach(p => console.log(`  [${p.isActive ? 'active' : 'inactive'}] ${p.name} | ${p.startDate} → ${p.endDate}`));

  const now = new Date();

  // Tìm hoặc tạo promotion "Siêu Sale Hot Deals"
  let promo = promos.find(p => p.name?.toLowerCase().includes('hot') || p.name?.toLowerCase().includes('sale'));

  if (!promo) {
    // Tạo promotion mới
    const result = await mongoose.connection.collection('promotions').insertOne({
      name: 'Siêu Sale Hot Deals',
      code: 'HOTDEAL2026',
      type: 'percentage',
      value: 20,
      isActive: true,
      startDate: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), // 7 ngày trước
      endDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),   // 30 ngày sau
      description: 'Siêu Sale Hot Deals - Giảm 20%',
      createdAt: now,
      updatedAt: now,
    });
    promo = { _id: result.insertedId, name: 'Siêu Sale Hot Deals' };
    console.log('\n✅ Tạo mới promotion:', promo.name);
  } else {
    // Cập nhật promotion cũ cho active và gia hạn
    await mongoose.connection.collection('promotions').updateOne(
      { _id: promo._id },
      { $set: {
        isActive: true,
        startDate: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
        endDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
        updatedAt: now,
      }}
    );
    console.log('\n✅ Cập nhật promotion:', promo.name);
  }

  // Gán promotion cho 8 sản phẩm đầu tiên
  const products = await mongoose.connection.collection('products')
    .find({ isActive: true })
    .limit(8)
    .toArray();

  let count = 0;
  for (const p of products) {
    await mongoose.connection.collection('products').updateOne(
      { _id: p._id },
      { $set: { promotion: promo._id } }
    );
    console.log(`  ✅ Gắn promo: ${p.name}`);
    count++;
  }

  console.log(`\n🎉 Xong! ${count} sản phẩm Hot Deals đã được khôi phục.`);
  await mongoose.disconnect();
}

fixHotDeals().catch(console.error);
