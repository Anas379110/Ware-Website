# Offline metadata validation

This directory contains the approved round-3 preflight contract and 53 metadata-only tests. It is not imported into the public website, does not retrieve sources or publish content, and grants no rights. News ingestion and automatic publication remain disabled.

Run from this directory with Node.js:

```sh
node --test preflight.test.mjs
```

The contract checks explicit permission/evidence fields, independent editorial approval, source identity/origin, requested fields, separate image evidence, revocation/expiry, original dates and provided duplicate snapshots. Translation dates never refresh original publication age. Invalid metadata is denied rather than filled from a clock, source or generated article.

A passing result is metadata validation only. Permission records are supplied inputs, not authenticated proof. Production needs trusted permission storage, provider-specific parsing, rights/editorial decisions, correction/removal rules, persistent deduplication and end-to-end review. No claim of exhaustive validation or a security audit.

Test constants are fixtures, not editorial freshness rules. No synthetic article text or headlines are included. No dependency or scheduler is added. The JSON runner is also an offline tool, not website runtime integration.

## JSON dry run

Run `node dry-run.mjs < private-input.json`. Input contains only an `items` array of preflight metadata inputs. Output is one JSON object with `dryRun: true`, counts and indexed results. No fetching, publishing, file writes, reservations or persistence.

Maximum input is 100 items and 1 MiB UTF-8. These are local resource guards, not editorial settings. Invalid JSON, UTF-8, container shape or size rejects the batch with one concise error and exit 2; normal runs exit 0 even when individual items are denied. Each item uses its supplied duplicate snapshot independently. Repeated candidates can both report eligible, but neither is published or reserved.

Run both suites with `node --test preflight.test.mjs dry-run.test.mjs`. There are 74 passing checks: 53 contract plus 21 runner tests. This is not a security audit or proof of rights. Output omits source evidence and attribution but includes stable item keys and original dates, so it remains private metadata, not a public sanitized report.
