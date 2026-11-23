// Offline contract only. No feed retrieval, public content or production wiring.
const nonblank = value => typeof value === 'string' && value.trim().length > 0;
const record = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const httpsUrl = value => {
  if (!nonblank(value)) return false;
  try { const u = new URL(value); return u.protocol === 'https:' && !u.username && !u.password; }
  catch { return false; }
};
const validDate = value => {
  if (typeof value !== 'string' || !/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:Z|[+-]\d\d:\d\d)$/.test(value) || !Number.isFinite(Date.parse(value))) return false;
  const [hour,minute,second] = value.slice(11,19).split(':').map(Number);
  if (hour > 23 || minute > 59 || second > 59) return false;
  const [year,month,day] = value.slice(0,10).split('-').map(Number);
  return month >= 1 && month <= 12 && day >= 1 && day <= new Date(Date.UTC(year,month,0)).getUTCDate();
};
export function preflight(input) {
  if (!record(input)) return {eligible:false,reasons:['INVALID_INPUT']};
  const {source, item, editorial, now, publishedKeys = []} = input;
  if (!record(source) || !record(item) || !record(editorial)) return {eligible:false,reasons:['INVALID_INPUT']};
  const reasons = [];
  if (!validDate(now)) return {eligible:false,reasons:['INVALID_CHECK_TIME']};
  if (!nonblank(source?.id) || item?.sourceId !== source.id) reasons.push('SOURCE_MISMATCH');
  if (source?.permission !== 'granted' || !nonblank(source?.evidenceRef)) reasons.push('PERMISSION_UNVERIFIED');
  if (source?.revoked === true) reasons.push('PERMISSION_REVOKED');
  if (source.revoked !== undefined && typeof source.revoked !== 'boolean') reasons.push('INVALID_REVOCATION_STATE');
  if (!Array.isArray(publishedKeys) || [...publishedKeys].some(key => !nonblank(key))) reasons.push('INVALID_DUPLICATE_STATE');
  if (!Array.isArray(source?.allowedFields) || !source.allowedFields.includes('headline')) reasons.push('HEADLINE_NOT_PERMITTED');
  if (source?.expiresAt !== undefined && (!validDate(source.expiresAt) || Date.parse(source.expiresAt) <= Date.parse(now))) reasons.push('PERMISSION_EXPIRED_OR_INVALID');
  if (editorial?.approved !== true || !nonblank(editorial?.approvalRef)) reasons.push('EDITORIAL_SCOPE_UNVERIFIED');
  if (!httpsUrl(item?.sourceUrl)) reasons.push('SOURCE_URL_INVALID');
  else if (!Array.isArray(source?.allowedOrigins) || !source.allowedOrigins.includes(new URL(item.sourceUrl).origin)) reasons.push('SOURCE_ORIGIN_NOT_APPROVED');
  if (!nonblank(item?.sourceItemId) || !nonblank(item?.attribution)) reasons.push('PROVENANCE_MISSING');
  if (!validDate(item?.originalPublishedAt)) reasons.push('ORIGINAL_DATE_INVALID');
  else {
    const age = Date.parse(now) - Date.parse(item.originalPublishedAt);
    if (age < 0) reasons.push('ORIGINAL_DATE_IN_FUTURE');
    if (!Number.isFinite(editorial?.maxAgeHours) || editorial.maxAgeHours < 0) reasons.push('FRESHNESS_RULE_UNSET');
    else if (age > editorial.maxAgeHours * 3600000) reasons.push('ARCHIVE_REQUIRES_REVIEW');
  }
  if (item?.translatedAt !== undefined && !validDate(item.translatedAt)) reasons.push('TRANSLATION_DATE_INVALID');
  if (!Array.isArray(item?.fields) || item.fields.length === 0 || new Set(item.fields).size !== item.fields.length || [...item.fields].some(field => !nonblank(field) || !Array.isArray(source.allowedFields) || !source.allowedFields.includes(field))) reasons.push('FIELD_NOT_PERMITTED');
  if (Array.isArray(item?.fields) && item.fields.includes('image') && (source?.imagePermission !== 'granted' || !nonblank(item.imageEvidenceRef))) reasons.push('IMAGE_RIGHTS_UNVERIFIED');
  const key = source?.id && item?.sourceItemId ? JSON.stringify([source.id,item.sourceItemId]) : null;
  if (key && Array.isArray(publishedKeys) && publishedKeys.includes(key)) reasons.push('ALREADY_PUBLISHED');
  return {eligible:reasons.length===0,reasons,key,originalPublishedAt:item?.originalPublishedAt ?? null};
}
