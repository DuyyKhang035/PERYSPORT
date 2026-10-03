import mongoose from 'mongoose';

const BannerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    desktopImage: {
      type: String,
      required: true,
    },
    mobileImage: {
      type: String,
      default: '',
    },
    ctaText: {
      type: String,
      default: 'Khám Phá Ngay',
    },
    ctaLink: {
      type: String,
      default: '/products',
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Banner || mongoose.model('Banner', BannerSchema);
