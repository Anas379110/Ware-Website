import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import { isPublished } from '../lib/content';
const paths = ['/', '/about', '/contact', '/privacy', '/terms'];
export async function GET({ site }: APIContext) {
  const articles = await getCollection('articles', isPublished);
  const publishedPaths = [...paths, ...articles.map((article) => `/article/${article.id}`)];
  // Do not advertise an unverified deployment origin in this local demo.
  const urls = site ? publishedPaths.map((path) => `<url><loc>${new URL(path, site)}</loc></url>`).join('') : '';
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
