import type { CollectionEntry } from 'astro:content';

// Existing one-day legacy threshold retained for compatibility
// Demo samples contain no financial figures
const FINANCIAL_STALE_AFTER_DAYS = 1;

const isNonBlank = (value: unknown): value is string => typeof value === 'string' && value.trim().length > 0;
const isValidDate = (value: unknown): value is Date => value instanceof Date && Number.isFinite(value.valueOf());

export function isPublished(entry: CollectionEntry<'articles'>): boolean {
  const { reviewedBy, publishDate, sources, financialFigures = [] } = entry.data;
  return isNonBlank(reviewedBy)
    && isValidDate(publishDate)
    && publishDate.valueOf() <= Date.now()
    && Array.isArray(sources) && sources.length > 0 && sources.every(isNonBlank)
    && Array.isArray(financialFigures) && financialFigures.every((figure) =>
      isNonBlank(figure.value) && isNonBlank(figure.source) && isValidDate(figure.asOfDate));
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
