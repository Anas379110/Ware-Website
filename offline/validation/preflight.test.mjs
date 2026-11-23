import test from 'node:test';
import assert from 'node:assert/strict';
import {preflight} from './preflight.mjs';
// Metadata-only fixtures. No fake headlines, articles or public-site samples.
const fixture = () => ({
 now:'2026-11-23T10:00:00Z',
 source:{id:'source-a',permission:'granted',evidenceRef:'test-only',allowedOrigins:['https://example.invalid'],allowedFields:['headline'],imagePermission:'unknown'},
 editorial:{approved:true,approvalRef:'test-only',maxAgeHours:24},
 item:{sourceId:'source-a',sourceItemId:'record-a',sourceUrl:'https://example.invalid/item',attribution:'fixture',originalPublishedAt:'2026-11-23T09:00:00Z',fields:['headline']}
});
const rejects=(data,reason)=>assert.ok(preflight(data).reasons.includes(reason));
test('eligible metadata requires both independent grants',()=>assert.equal(preflight(fixture()).eligible,true));
test('missing source authority fails closed',()=>{const x=fixture();x.source.permission='pending';rejects(x,'PERMISSION_UNVERIFIED')});
test('permission evidence is mandatory',()=>{const x=fixture();delete x.source.evidenceRef;rejects(x,'PERMISSION_UNVERIFIED')});
test('editorial authority remains independent',()=>{const x=fixture();x.editorial.approved=false;rejects(x,'EDITORIAL_SCOPE_UNVERIFIED')});
test('revocation stops new eligibility',()=>{const x=fixture();x.source.revoked=true;rejects(x,'PERMISSION_REVOKED')});
test('expiry at exact check instant denies',()=>{const x=fixture();x.source.expiresAt=x.now;rejects(x,'PERMISSION_EXPIRED_OR_INVALID')});
test('missing original date never filled from retrieval',()=>{const x=fixture();delete x.item.originalPublishedAt;x.item.retrievedAt=x.now;rejects(x,'ORIGINAL_DATE_INVALID')});
test('future original date denies',()=>{const x=fixture();x.item.originalPublishedAt='2026-11-24T09:00:00Z';rejects(x,'ORIGINAL_DATE_IN_FUTURE')});
test('recent translation does not refresh old original',()=>{const x=fixture();x.item.originalPublishedAt='2024-06-06T09:00:00Z';x.item.translatedAt=x.now;rejects(x,'ARCHIVE_REQUIRES_REVIEW')});
test('no implicit freshness default',()=>{const x=fixture();delete x.editorial.maxAgeHours;rejects(x,'FRESHNESS_RULE_UNSET')});
test('intro requires its own allowed field',()=>{const x=fixture();x.item.fields.push('intro');rejects(x,'FIELD_NOT_PERMITTED')});
test('photo not inherited from text permission',()=>{const x=fixture();x.source.allowedFields.push('image');x.item.fields.push('image');rejects(x,'IMAGE_RIGHTS_UNVERIFIED')});
test('photo authority also needs image evidence',()=>{const x=fixture();x.source.allowedFields.push('image');x.source.imagePermission='granted';x.item.fields.push('image');rejects(x,'IMAGE_RIGHTS_UNVERIFIED')});
test('source identity must match',()=>{const x=fixture();x.item.sourceId='source-b';rejects(x,'SOURCE_MISMATCH')});
test('same item cannot be reissued',()=>{const x=fixture();x.publishedKeys=[preflight(x).key];rejects(x,'ALREADY_PUBLISHED')});
test('unrelated sources have distinct duplicate keys',()=>{const a=fixture(),b=fixture();b.source.id=b.item.sourceId='source-b';assert.notEqual(preflight(a).key,preflight(b).key)});
test('source links cannot carry userinfo',()=>{const x=fixture();x.item.sourceUrl='https://name:secret@example.invalid/';rejects(x,'SOURCE_URL_INVALID')});
test('relative date cannot silently use device timezone',()=>{const x=fixture();x.item.originalPublishedAt='2026-11-23';rejects(x,'ORIGINAL_DATE_INVALID')});
test('invalid check time denies instead of consulting clock',()=>{const x=fixture();x.now='';rejects(x,'INVALID_CHECK_TIME')});
test('validator does not mutate metadata',()=>{const x=fixture(),before=JSON.stringify(x);preflight(x);assert.equal(JSON.stringify(x),before)});

test('calendar rollover date denied',()=>{const x=fixture();x.item.originalPublishedAt='2026-02-30T09:00:00Z';rejects(x,'ORIGINAL_DATE_INVALID')});
test('unapproved origin denied even with source ID',()=>{const x=fixture();x.item.sourceUrl='https://other.invalid/item';rejects(x,'SOURCE_ORIGIN_NOT_APPROVED')});
test('missing origin scope denies',()=>{const x=fixture();delete x.source.allowedOrigins;rejects(x,'SOURCE_ORIGIN_NOT_APPROVED')});
test('string false is not editorial approval',()=>{const x=fixture();x.editorial.approved='false';assert.equal(preflight(x).eligible,false)});
test('blank permission evidence rejected',()=>{const x=fixture();x.source.evidenceRef=' ';assert.equal(preflight(x).eligible,false)});
test('blank editorial evidence rejected',()=>{const x=fixture();x.editorial.approvalRef=' ';assert.equal(preflight(x).eligible,false)});
test('blank attribution rejected',()=>{const x=fixture();x.item.attribution=' ';assert.equal(preflight(x).eligible,false)});
test('blank stable item identity rejected',()=>{const x=fixture();x.item.sourceItemId=' ';assert.equal(preflight(x).eligible,false)});
test('empty requested field list denied',()=>{const x=fixture();x.item.fields=[];assert.equal(preflight(x).eligible,false)});
test('corrupt allowed-field object denied without throw',()=>{const x=fixture();x.source.allowedFields={};assert.equal(preflight(x).eligible,false)});
test('corrupt dedupe state denied without throw',()=>{const x=fixture();x.publishedKeys={};assert.equal(preflight(x).eligible,false)});
test('missing input denied without throw',()=>assert.equal(preflight().eligible,false));
test('null input denied without throw',()=>assert.equal(preflight(null).eligible,false));
test('revocation string cannot silently mean not revoked',()=>{const x=fixture();x.source.revoked='false';assert.equal(preflight(x).eligible,false)});
test('exact allowed age boundary stays eligible',()=>{const x=fixture();x.item.originalPublishedAt='2026-11-22T10:00:00Z';assert.equal(preflight(x).eligible,true)});
test('one second beyond allowed age requires review',()=>{const x=fixture();x.item.originalPublishedAt='2026-11-22T09:59:59Z';rejects(x,'ARCHIVE_REQUIRES_REVIEW')});
test('timezone equivalent future check stays eligible',()=>{const x=fixture();x.item.originalPublishedAt='2026-11-23T12:00:00+03:00';assert.equal(preflight(x).eligible,true)});
test('invalid offset denied',()=>{const x=fixture();x.item.originalPublishedAt='2026-11-23T09:00:00+24:00';rejects(x,'ORIGINAL_DATE_INVALID')});
test('duplicate requested fields denied',()=>{const x=fixture();x.item.fields.push('headline');assert.equal(preflight(x).eligible,false)});
test('mixed-case permission is not silently accepted',()=>{const x=fixture();x.source.permission='Granted';assert.equal(preflight(x).eligible,false)});
test('blank expiry cannot mean perpetual permission',()=>{const x=fixture();x.source.expiresAt='';assert.equal(preflight(x).eligible,false)});

// Round 3: strict metadata types and timestamp rollover, still offline only.
test('24-hour rollover timestamp denied',()=>{const x=fixture();x.item.originalPublishedAt='2026-11-22T24:00:00Z';rejects(x,'ORIGINAL_DATE_INVALID')});
test('array source URL cannot be coerced into a string',()=>{const x=fixture();x.item.sourceUrl=['https://example.invalid/item'];rejects(x,'SOURCE_URL_INVALID')});
for(const value of ['',null,false,0]) test(`present malformed translation date denies: ${JSON.stringify(value)}`,()=>{const x=fixture();x.item.translatedAt=value;rejects(x,'TRANSLATION_DATE_INVALID')});
test('sparse requested fields deny',()=>{const x=fixture();x.item.fields=Array(1);rejects(x,'FIELD_NOT_PERMITTED')});
test('sparse duplicate-state entries deny',()=>{const x=fixture();x.publishedKeys=Array(1);rejects(x,'INVALID_DUPLICATE_STATE')});
test('nonstring field entry cannot be authorized by matching malformed config',()=>{const x=fixture();x.source.allowedFields.push(null);x.item.fields.push(null);rejects(x,'FIELD_NOT_PERMITTED')});
test('blank field entry cannot be authorized by malformed config',()=>{const x=fixture();x.source.allowedFields.push(' ');x.item.fields.push(' ');rejects(x,'FIELD_NOT_PERMITTED')});
test('separately permitted intro metadata remains accepted',()=>{const x=fixture();x.source.allowedFields.push('intro');x.item.fields.push('intro');assert.equal(preflight(x).eligible,true)});
test('separately permitted evidenced image metadata remains accepted',()=>{const x=fixture();x.source.allowedFields.push('image');x.source.imagePermission='granted';x.item.fields.push('image');x.item.imageEvidenceRef='test-only';assert.equal(preflight(x).eligible,true)});
