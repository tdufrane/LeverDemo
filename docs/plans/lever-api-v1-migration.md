# Lever API v1 Migration & Pagination — Implementation Plan

**Created:** January 27, 2026
**Source:** `docs/plans/lever-api-performance-improvements.md` (Issues #1 and #2)
**Scope:** Critical/High priority items only (v1 API migration + pagination)
**IE11:** Not required — modern JS is acceptable

---

## Phase 1: Migrate to v1 API endpoint

**Goal:** Replace the deprecated v0 endpoint with v1 and adapt data handling to the new response format.

**Files to modify:**
- `loader.js`

**Tasks:**

1. Update the API URL (line 47-50) from:
   ```
   https://api.lever.co/v0/postings/{account}?group=team&mode=json
   ```
   to:
   ```
   https://api.lever.co/v1/postings/{account}?mode=json
   ```

2. Adapt `createJobs()` to handle the v1 response format. The v0 API returns data grouped by team; v1 returns a flat array under `data`. The grouping logic in `createJobs()` already handles building department/team groups from flat postings — but the input iteration needs to change from iterating grouped teams to iterating the flat `data` array.

3. Remove IE polyfills (lines 238-305) — `findIndex` polyfill and `CustomEvent` polyfill are no longer needed since IE11 is not supported.

**Acceptance criteria:**
- Jobs load correctly from the v1 endpoint
- Department and team grouping still works
- Filters still work after data loads
- IE polyfills are removed
- No regressions in existing functionality

**Dependencies:** None

**Execution:** Can run independently

---

## Phase 2: Add pagination support

**Goal:** Handle accounts with more than 100 postings by following the Lever API pagination protocol.

**Files to modify:**
- `loader.js`

**Tasks:**

1. Replace the `XMLHttpRequest` approach (lines 214-233) with `fetch` (IE11 not required).

2. Implement a pagination loop that:
   - Makes initial request to the v1 URL
   - Checks `hasNext` in the response
   - Uses `next` as the `offset` parameter for subsequent requests
   - Concatenates all `data` arrays into a single postings array

3. Pass the aggregated postings array to `createJobs()`.

4. Add basic error handling for non-200 responses during pagination (log and stop, don't silently truncate).

**Acceptance criteria:**
- Single-page results (under 100 postings) still work
- Multi-page results are fully fetched and rendered
- Network errors during pagination are surfaced to the user
- No duplicate postings appear

**Dependencies:** Phase 1 (needs v1 endpoint in place)

**Execution:** Sequential after Phase 1

---

## Execution Strategy

```
Phase 1 (v1 migration) → Phase 2 (pagination)
```

Both phases are sequential. Phase 2 depends on Phase 1 because pagination uses the v1 response format.

---

## Notes

- With fewer than 100 postings currently, Phase 2 is a safeguard rather than an immediate fix. Phase 1 is the urgent change.
- The v0 `?group=team` parameter handles server-side grouping. After migrating to v1 (flat response), the existing client-side grouping logic in `createJobs()` already handles this — the outer loop just needs adjustment.
