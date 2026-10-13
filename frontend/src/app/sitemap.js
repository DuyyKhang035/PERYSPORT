import { fetchBackend } from '@/lib/api-may-chu';

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  let products = [];
  let posts = [];

  try {
    const [productResponse, postResponse] = await Promise.all([
      fetchBackend('/api/products?limit=1000'),
      fetchBackend('/api/posts?status=published&limit=1000'),
    ]);
    products = productResponse.data || [];
    posts = postResponse.data || [];
  } catch (e) {
    console.error(e);
  }

  const productUrls = products.map((p) => ({
    url: `${baseUrl}/san-pham/${p.slug}`,
    lastModified: p.updatedAt || new Date(),
  }));

  const postUrls = posts.map((post) => ({
    url: `${baseUrl}/tin-tuc/${post.slug}`,
    lastModified: post.updatedAt || new Date(),
  }));

  return [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/san-pham`, lastModified: new Date() },
    { url: `${baseUrl}/thuong-hieu`, lastModified: new Date() },
    { url: `${baseUrl}/tin-tuc`, lastModified: new Date() },
    { url: `${baseUrl}/lien-he`, lastModified: new Date() },
    ...productUrls,
    ...postUrls,
  ];
}
