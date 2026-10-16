import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts: { title: string; description: string; pubDate: Date; link: string }[] = [];
  return rss({
    title: 'Improved365 — Microsoft Dynamics 365 Finance & Operations',
    description: 'Helping businesses get more from Microsoft Dynamics 365 Finance & Operations. Upgrade experts from Dynamics AX 2012 to D365 F&O — implement, customize, integrate, optimize, and support.',
    site: context.site,
    items: posts
  });
}
