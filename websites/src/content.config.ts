import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const financialFigure = z.object({
  value: z.string(),
  asOfDate: z.date(), // إلزامي لكل رقم مالي — منع تضليل بأرقام بلا سياق زمني
  source: z.string(),
});

const articles = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    publishDate: z.date(),
    country: z.enum(['السعودية', 'الإمارات', 'قطر', 'الكويت', 'عام_خليجي']),
    type: z.enum(['خبر', 'تحليل_سوق', 'دليل_استثمار', 'دليل_عقاري', 'شركات_ناشئة']),
    financialFigures: z.array(financialFigure).optional(),
    disclaimerShown: z.boolean().default(true), // يُفرض true دائمًا (D — غير قابل للتعطيل يدويًا)
    sources: z.array(z.string()).min(1),
    reviewedBy: z.string(),
    reviewedAt: z.date().optional(),
    aiGenerated: z.boolean().default(false),
    syntheticDemo: z.boolean().default(false),
    excerpt: z.string().max(160),
  }),
});

export const collections = { articles };
