import { describe, it, expect } from 'vitest';
import { isPublished, hasStaleFinancialData, sortByDateDesc, filterByCountry } from './content';
import type { CollectionEntry } from 'astro:content';

function makeEntry(overrides: Partial<CollectionEntry<'articles'>['data']> & { slug?: string }) {
  const { slug = 'test-slug', ...data } = overrides;
  return {
    slug,
    data: {
      title: 'تحليل تجريبي',
      publishDate: new Date('2026-01-01'),
      country: 'السعودية' as const,
      type: 'تحليل_سوق' as const,
      disclaimerShown: true,
      sources: ['مصدر مالي'],
      reviewedBy: '',
      aiGenerated: false,
      excerpt: 'ملخص',
      ...data,
    },
  } as unknown as CollectionEntry<'articles'>;
}

describe('hasStaleFinancialData — عتبة يوم واحد (مؤكَّد من المستخدم)', () => {
  it('رقم بنفس اليوم ليس قديمًا', () => {
    const now = new Date('2026-01-01T18:00:00');
    const entry = makeEntry({
      financialFigures: [{ value: '100', asOfDate: new Date('2026-01-01T09:00:00'), source: 'تداول' }],
    });
    expect(hasStaleFinancialData(entry, now)).toBe(false);
  });

  it('رقم بعمر يومين يُعتبر قديمًا', () => {
    const now = new Date('2026-01-03');
    const entry = makeEntry({
      financialFigures: [{ value: '100', asOfDate: new Date('2026-01-01'), source: 'تداول' }],
    });
    expect(hasStaleFinancialData(entry, now)).toBe(true);
  });

  it('يكفي رقم واحد قديم ضمن عدة أرقام لإظهار التنبيه', () => {
    const now = new Date('2026-01-03');
    const entry = makeEntry({
      financialFigures: [
        { value: '100', asOfDate: new Date('2026-01-02T12:00:00'), source: 'تداول' }, // حديث (أقل من يوم)
        { value: '200', asOfDate: new Date('2026-01-01'), source: 'دبي المالي' }, // قديم (يومان)
      ],
    });
    expect(hasStaleFinancialData(entry, now)).toBe(true);
  });

  it('بلا أرقام مالية إطلاقًا = ليس قديمًا (لا خطأ)', () => {
    expect(hasStaleFinancialData(makeEntry({}))).toBe(false);
  });
});

describe('filterByCountry', () => {
  it('يفلتر حسب الدولة بدقة', () => {
    const sa = makeEntry({ slug: 'sa', country: 'السعودية' });
    const ae = makeEntry({ slug: 'ae', country: 'الإمارات' });
    expect(filterByCountry([sa, ae], 'السعودية')).toHaveLength(1);
  });
});

describe('isPublished/sortByDateDesc', () => {
  it('يرفض بلا مراجع', () => {
    expect(isPublished(makeEntry({ reviewedBy: '' }))).toBe(false);
  });
  it('يرتب الأحدث أولًا', () => {
    const old = makeEntry({ slug: 'old', publishDate: new Date('2025-01-01') });
    const recent = makeEntry({ slug: 'recent', publishDate: new Date('2026-06-01') });
    expect(sortByDateDesc([old, recent])[0].slug).toBe('recent');
  });
});
