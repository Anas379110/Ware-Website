import type { CollectionEntry } from 'astro:content';

// مؤكَّد من المستخدم: يوم واحد فقط — أرقام سوق الأسهم تتقادم يوميًا
const FINANCIAL_STALE_AFTER_DAYS = 1;

export function isPublished(entry: CollectionEntry<'articles'>): boolean {
  return entry.data.reviewedBy.trim() !== '';
}

export function sortByDateDesc(entries: CollectionEntry<'articles'>[]): CollectionEntry<'articles'>[] {
  return [...entries].sort((a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf());
}

/**
 * FR: أي رقم مالي أقدم من العتبة يُعرض بتنبيه "بيانات قد تكون قديمة" (SRS.md — Use Case).
 * تُفحص كل الأرقام بالمقال؛ يكفي رقم واحد قديم ليُظهر التنبيه (Conservative — أكثر أمانًا للقارئ).
 */
export function hasStaleFinancialData(entry: CollectionEntry<'articles'>, now: Date = new Date()): boolean {
  const figures = entry.data.financialFigures ?? [];
  return figures.some((f) => {
    const ageDays = (now.valueOf() - f.asOfDate.valueOf()) / (1000 * 60 * 60 * 24);
    return ageDays > FINANCIAL_STALE_AFTER_DAYS;
  });
}

export function filterByCountry(entries: CollectionEntry<'articles'>[], country: string): CollectionEntry<'articles'>[] {
  return entries.filter((e) => e.data.country === country);
}
