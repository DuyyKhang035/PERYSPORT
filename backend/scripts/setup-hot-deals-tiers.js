require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

async function main() {
  await mongoose.connect(process.env.MONGODB_URI, { dbName: 'pery_sport' });
  console.log('Connected to MongoDB Atlas:', mongoose.connection.name);

  const now = new Date();
  const startDate = new Date('2026-10-01T00:00:00.000Z');
  const endDate = new Date('2027-01-01T00:00:00.000Z');

  // Tiered promotions
  const tieredPromotions = [
    { name: 'Flash Deal Giờ Vàng 50%', code: 'FLASH50', type: 'percentage', value: 50 },
    { name: 'Siêu Giảm Giá 45%', code: 'SALE45', type: 'percentage', value: 45 },
    { name: 'Deal Sốc Mùa Hè 40%', code: 'HOTDEAL40', type: 'percentage', value: 40 },
    { name: 'Ưu Đãi Đặc Biệt 35%', code: 'SPECIAL35', type: 'percentage', value: 35 },
    { name: 'Siêu Sale Mùa Hè 30%', code: 'SUMMER30', type: 'percentage', value: 30 },
    { name: 'Tuần Lễ Vàng Thể Thao 25%', code: 'GOLD25', type: 'percentage', value: 25 },
    { name: 'Ưu Đãi Thành Viên 20%', code: 'MEMBER20', type: 'percentage', value: 20 },
    { name: 'Khuyến Mãi Mở Bán 15%', code: 'LAUNCH15', type: 'percentage', value: 15 },
    { name: 'Khuyến Mãi Trải Nghiệm 10%', code: 'EXP10', type: 'percentage', value: 10 },
  ];

  const promoMap = {};
  for (const pData of tieredPromotions) {
    const existing = await mongoose.connection.collection('promotions').findOne({
      $or: [{ code: pData.code }, { name: pData.name }, { value: pData.value, type: 'percentage' }]
    });

    if (existing) {
      await mongoose.connection.collection('promotions').updateOne(
        { _id: existing._id },
        {
          $set: {
            name: pData.name,
            code: pData.code,
            type: 'percentage',
            value: pData.value,
            startDate,
            endDate,
            isActive: true,
            updatedAt: now,
          }
        }
      );
      promoMap[pData.value] = existing._id;
    } else {
      const res = await mongoose.connection.collection('promotions').insertOne({
        name: pData.name,
        code: pData.code,
        type: 'percentage',
        value: pData.value,
        startDate,
        endDate,
        applicableProducts: [],
        isActive: true,
        createdAt: now,
        updatedAt: now,
      });
      promoMap[pData.value] = res.insertedId;
    }
  }

  // Deactivate or set expired the 200k fixed promo to avoid unexpected %
  await mongoose.connection.collection('promotions').updateMany(
    { type: 'fixed' },
    { $set: { isActive: false } }
  );

  const products = await mongoose.connection.collection('products')
    .find({ isActive: true })
    .toArray();

  // Distinct tiers mapping to guarantee top 8 are strictly descending:
  // 50% -> Pery Runner Pro X1
  // 45% -> Adidas Ultraboost Light
  // 40% -> Nike Jordan Stay Loyal 2
  // 35% -> Puma Deviate Nitro 2
  // 30% -> New Balance Fresh Foam X 1080v12
  // 25% -> Pery Court Beast Dunk
  // 20% -> Nike Air Zoom Pegasus 40
  // 15% -> Pery Aero Strike Nitro
  // 10% -> Nike Metcon 9 Training
  // 10% -> Pery Speed Ultra 2
  // 10% -> Pery Flex Gym Pro
  // 10% -> Pery Urban Walk Max
  const assignments = [
    { slug: 'pery-runner-pro-x1', discount: 50 },
    { slug: 'adidas-ultraboost-light', discount: 45 },
    { slug: 'nike-jordan-stay-loyal-2', discount: 40 },
    { slug: 'puma-deviate-nitro-2', discount: 35 },
    { slug: 'new-balance-fresh-foam-x-1080v12', discount: 30 },
    { slug: 'pery-court-beast-dunk', discount: 25 },
    { slug: 'nike-air-zoom-pegasus-40', discount: 20 },
    { slug: 'pery-aero-strike-nitro', discount: 15 },
    { slug: 'nike-metcon-9-training', discount: 10 },
    { slug: 'pery-speed-ultra-2', discount: 10 },
    { slug: 'pery-flex-gym-pro', discount: 10 },
    { slug: 'pery-urban-walk-max', discount: 10 },
  ];

  for (const assign of assignments) {
    const promoId = promoMap[assign.discount];
    if (!promoId) continue;

    const prod = products.find(p => p.slug === assign.slug);
    if (prod) {
      const newSalePrice = Math.round(prod.originalPrice * (1 - assign.discount / 100));
      await mongoose.connection.collection('products').updateOne(
        { _id: prod._id },
        {
          $set: {
            promotion: promoId,
            salePrice: newSalePrice,
            updatedAt: now,
          }
        }
      );
    }
  }

  // Clear promotion from non-hot deal products
  const hotSlugs = assignments.map(a => a.slug);
  await mongoose.connection.collection('products').updateMany(
    { slug: { $nin: hotSlugs } },
    { $set: { promotion: null, updatedAt: now } }
  );

  console.log('Successfully updated promotions and assigned tiered discounts.');
  await mongoose.disconnect();
}

main().catch(console.error);
