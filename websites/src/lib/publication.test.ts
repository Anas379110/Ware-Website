import { describe, expect, it } from 'vitest';
import { isPublished } from './content';
import type { CollectionEntry } from 'astro:content';
const entry = (data: Record<string, unknown> = {}) => ({ data: {
  reviewedBy: 'Editor', publishDate: new Date('2026-01-01T00:00:00Z'),
  sources: ['https://example.com/source'], financialFigures: [], ...data,
} }) as unknown as CollectionEntry<'articles'>;
describe('publication boundary', () => {
  it('allows a reviewed past article with source', () => expect(isPublished(entry())).toBe(true));
  it('rejects whitespace reviewer', () => expect(isPublished(entry({ reviewedBy: '  ' }))).toBe(false));
  it('rejects no sources', () => expect(isPublished(entry({ sources: [] }))).toBe(false));
  it('rejects a blank source', () => expect(isPublished(entry({ sources: [' '] }))).toBe(false));
  it('rejects an invalid publication date', () => expect(isPublished(entry({ publishDate: new Date('invalid') }))).toBe(false));
  it('holds future-dated content', () => expect(isPublished(entry({ publishDate: new Date('2999-01-01') }))).toBe(false));
  it('rejects blank financial source', () => expect(isPublished(entry({ financialFigures: [{ value: '100', source: ' ', asOfDate: new Date('2026-01-01') }] }))).toBe(false));
  it('rejects blank financial value', () => expect(isPublished(entry({ financialFigures: [{ value: ' ', source: 'Source', asOfDate: new Date('2026-01-01') }] }))).toBe(false));
  it('rejects invalid figure date', () => expect(isPublished(entry({ financialFigures: [{ value: '100', source: 'Source', asOfDate: new Date('invalid') }] }))).toBe(false));
});
