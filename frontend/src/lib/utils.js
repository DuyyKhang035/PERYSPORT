export function formatVND(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) return '0 ₫';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
}

export function slugify(str) {
  if (!str) return '';
  str = str.toLowerCase();
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
  str = str.replace(/đ/g, 'd');
  str = str.replace(/[^a-z0-9 -]/g, '');
  str = str.replace(/\s+/g, '-');
  str = str.replace(/-+/g, '-');
  return str.trim();
}

export function generateOrderCode() {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomStr = Math.floor(1000 + Math.random() * 9000);
  return `PS-${dateStr}-${randomStr}`;
}

export function calculateDiscount(price, promotion) {
  if (!promotion || !promotion.isActive) return { finalPrice: price, discountAmount: 0, percentage: 0 };

  const now = new Date();
  if (promotion.startDate && new Date(promotion.startDate) > now) {
    return { finalPrice: price, discountAmount: 0, percentage: 0 };
  }
  if (promotion.endDate && new Date(promotion.endDate) < now) {
    return { finalPrice: price, discountAmount: 0, percentage: 0 };
  }

  let discountAmount = 0;
  let percentage = 0;

  if (promotion.type === 'percentage') {
    percentage = promotion.value;
    discountAmount = Math.round((price * promotion.value) / 100);
  } else if (promotion.type === 'fixed') {
    discountAmount = promotion.value;
    percentage = Math.round((discountAmount / price) * 100);
  }

  const finalPrice = Math.max(0, price - discountAmount);
  return { finalPrice, discountAmount, percentage };
}

export function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'Asia/Ho_Chi_Minh',
  }).format(date);
}

export function formatDateTime(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Ho_Chi_Minh',
  }).format(date);
}
