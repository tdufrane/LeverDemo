# Lever API Performance Improvement Plan

**Created:** January 27, 2026  
**Status:** Draft - Pending Review  
**Affected Files:** `loader.js`, `filters.js`

---

## Executive Summary

This document outlines performance gaps identified in the LeverDemo project when compared against the [Lever API documentation](https://hire.lever.co/developer/documentation). The current implementation uses deprecated endpoints, lacks pagination support, and has no error recovery mechanisms.

---

## Identified Issues

### 1. Deprecated v0 API Endpoint

**Severity:** 🔴 Critical  
**File:** `loader.js` (Line 48)

**Current Implementation:**
```javascript
var url = "https://api.lever.co/v0/postings/" + options.accountName + "?group=team&mode=json";
```

**Problem:**  
The v0 API is deprecated. The official API documentation specifies v1 as the current version at `https://api.lever.co/v1`.

**Risk:**  
- The v0 endpoint could be removed at any time
- May have slower response times
- Missing newer features and optimizations

**Recommended Fix:**
```javascript
var url = "https://api.lever.co/v1/postings?" + 
  "state=published&" +
  "distributionChannel=public";
```

---

### 2. No Pagination Support

**Severity:** 🔴 High  
**File:** `loader.js`

**Current Implementation:**  
Single API request with no pagination handling.

**Problem:**  
The Lever API returns a maximum of 100 results per request by default. If the account has more than 100 job postings, data will be truncated.

**API Pagination Parameters:**
| Parameter | Description |
|-----------|-------------|
| `limit` | Number of results (1-100, default 100) |
| `offset` | Token for next page of results |
| `hasNext` | Boolean indicating more results exist |

**Recommended Fix:**
```javascript
async function fetchAllPostings(baseUrl) {
  let allPostings = [];
  let offset = null;
  let hasNext = true;
  
  while (hasNext) {
    const url = offset 
      ? `${baseUrl}&offset=${offset}` 
      : baseUrl;
    
    const response = await fetch(url);
    const data = await response.json();
    
    allPostings = allPostings.concat(data.data);
    hasNext = data.hasNext;
    offset = data.next;
  }
  
  return allPostings;
}
```

---

### 3. No Rate Limiting / Retry Logic

**Severity:** 🟡 Medium  
**File:** `loader.js`

**Current Implementation:**  
No retry logic or rate limit handling.

**Problem:**  
Lever API enforces rate limits:
- **Steady state:** 10 requests/second per API key
- **Burst:** Up to 20 requests/second

HTTP 429 responses indicate rate limiting. Without retry logic, requests fail silently.

**Recommended Fix:**
```javascript
async function fetchWithRetry(url, maxRetries = 3) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(url);
      
      if (response.status === 429) {
        // Rate limited - exponential backoff
        const delay = Math.pow(2, attempt) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      
      if (response.status === 503) {
        // Service unavailable - retry with backoff
        const delay = Math.pow(2, attempt) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      if (attempt === maxRetries - 1) throw error;
    }
  }
}
```

---

### 4. Missing Response Field Optimization

**Severity:** 🟡 Medium  
**File:** `loader.js`

**Current Implementation:**  
Fetches all posting fields.

**Problem:**  
The application only uses a subset of fields:
- `text` (job title)
- `categories` (team, department, location, commitment)
- `hostedUrl`

Fetching unnecessary data increases bandwidth and response time.

**Recommended Fix:**  
Use the `include` parameter to request only needed fields:
```javascript
var url = baseUrl + "&include=text&include=categories&include=hostedUrl";
```

---

### 5. Generic Error Handling

**Severity:** 🟡 Medium  
**File:** `loader.js` (Lines 218-228)

**Current Implementation:**
```javascript
request.onerror = handleError;
```

**Problem:**  
All errors are treated the same. Different HTTP status codes require different handling:

| Status | Meaning | Action |
|--------|---------|--------|
| 401 | Unauthorized | Show auth error message |
| 403 | Forbidden | Show permissions error |
| 429 | Rate Limited | Retry with exponential backoff |
| 500 | Server Error | Retry with backoff |
| 503 | Maintenance | Retry with backoff |

**Recommended Fix:**
```javascript
request.onload = function() {
  switch (request.status) {
    case 200:
      createJobs(request.response);
      break;
    case 401:
      showError("Authentication failed. Please check API credentials.");
      break;
    case 429:
      retryWithBackoff(url, attempt + 1);
      break;
    case 503:
      retryWithBackoff(url, attempt + 1);
      break;
    default:
      handleError();
  }
};
```

---

### 6. Inefficient DOM Manipulation

**Severity:** 🟢 Low  
**File:** `filters.js` (Line 13)

**Current Implementation:**
```javascript
$(".lever-job").clone().appendTo("#new-list ul");
```

**Problem:**  
Synchronous cloning of all job elements blocks the main thread, causing UI jank with large datasets.

**Recommended Fix:**  
Use `DocumentFragment` for batch DOM operations:
```javascript
var fragment = document.createDocumentFragment();
var jobs = document.querySelectorAll('.lever-job');
jobs.forEach(function(job) {
  fragment.appendChild(job.cloneNode(true));
});
document.querySelector('#new-list ul').appendChild(fragment);
```

---

### 7. O(n²) Duplicate Detection in Filters

**Severity:** 🟢 Low  
**File:** `filters.js` (Lines 25-44)

**Current Implementation:**
```javascript
if(jQuery.inArray(location, locations) == -1) {
  locations.push(location);
}
```

**Problem:**  
`jQuery.inArray()` is O(n), called for each item, resulting in O(n²) complexity.

**Recommended Fix:**  
Use ES6 `Set` for O(1) lookups:
```javascript
var locationSet = new Set();
var departmentSet = new Set();
var teamSet = new Set();
var workTypeSet = new Set();

for (var i = 0; i < jobList.items.length; i++) {
  var item = jobList.items[i]._values;
  locationSet.add(item.location);
  departmentSet.add(item.department);
  teamSet.add(item.team);
  workTypeSet.add(item["work-type"]);
}

var locations = Array.from(locationSet).sort();
var departments = Array.from(departmentSet).sort();
var teams = Array.from(teamSet).sort();
var workTypes = Array.from(workTypeSet).sort();
```

---

## Implementation Priority

| Priority | Issue | Effort | Impact |
|----------|-------|--------|--------|
| 1 | Migrate to v1 API | Medium | Critical |
| 2 | Add pagination support | Medium | High |
| 3 | Implement retry logic | Low | Medium |
| 4 | Add field filtering | Low | Medium |
| 5 | Improve error handling | Low | Medium |
| 6 | Optimize DOM manipulation | Low | Low |
| 7 | Use Set for deduplication | Low | Low |

---

## Testing Checklist

- [ ] Verify v1 API endpoint returns expected data structure
- [ ] Test pagination with accounts having 100+ postings
- [ ] Simulate 429 responses to verify retry logic
- [ ] Measure payload size reduction with `include` parameter
- [ ] Performance test with 500+ job postings
- [ ] Cross-browser testing (IE11 if required)

---

## Rollback Plan

1. Keep original `loader.js` as `loader.legacy.js`
2. Use feature flag to toggle between implementations
3. Monitor error rates for 24 hours post-deployment

---

## Questions for Review

1. Is IE11 support still required? (Affects use of `async/await`, `Set`, `fetch`)
2. What is the expected maximum number of job postings?
3. Are there any caching requirements for the API responses?
4. Should we add loading indicators during pagination?

---

## Approval

- [ ] Technical Review
- [ ] Code Review
- [ ] QA Sign-off
