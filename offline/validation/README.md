# Offline metadata validation

This directory contains the approved round-3 preflight contract and 53 metadata-only tests. It is not imported into the public website, does not retrieve sources or publish content, and grants no rights. News ingestion and automatic publication remain disabled.

Run from this directory with Node.js:

```sh
node --test preflight.test.mjs
```

The contract checks explicit permission/evidence fields, independent editorial approval, source identity/origin, requested fields, separate image evidence, revocation/expiry, original dates and provided duplicate snapshots. Translation dates never refresh original publication age. Invalid metadata is denied rather than filled from a clock, source or generated article.

A passing result is metadata validation only. Permission records are supplied inputs, not authenticated proof. Production needs trusted permission storage, provider-specific parsing, rights/editorial decisions, correction/removal rules, persistent deduplication and end-to-end review. No claim of exhaustive validation or a security audit.

Test constants are fixtures, not editorial freshness rules. No synthetic article text or headlines are included. No dependency or scheduler is added. The separate later JSON batch runner is deliberately excluded from this approved release.
