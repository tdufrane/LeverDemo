# Lever Jobs API Integration

This project provides a customizable integration with the Lever Jobs API to display job postings on your website, with support for filtering by department, team, location, and work type.

## Overview

The `index.js` file contains the `loadLeverJobs()` function that fetches job postings from the Lever API and renders them in an organized, searchable format on your webpage.

## Features

- Fetches job postings from Lever API
- Organizes jobs by department and team
- Department filtering (pre-filter jobs by specific departments)
- Automatically hides department filter UI when department filter is defined
- Search functionality with list.js integration
- Filter by location, department, team, and work type
- Responsive design for mobile devices
- IE compatibility with polyfills

## Building

```bash
npm install          # install dependencies
npm run build        # bundle src/ → index.js
npm run build:min    # bundle src/ → index.min.js (minified)
npm run build:all    # build both
```

Source files are in `src/`. Edit those and run `npm run build` to regenerate `index.js`.

## Setup

### Basic Usage

1. Include the required scripts in your HTML:

```html
<script src="jquery-3.6.1.js"></script>
<script src="index.js"></script>
```

2. Add the container element where jobs will be displayed:

```html
<div id="lever-jobs-container"></div>
```

3. Initialize the job loader with your Lever account name:

```html
<script type="text/javascript">
  window.leverJobsOptions = {
    accountName: 'YourCompanyName'
  };
</script>
<script src="index.js"></script>
```

### Advanced Configuration

#### Filter by Department

You can pre-filter jobs to show only specific departments:

```html
<script type="text/javascript">
  window.leverJobsOptions = {
    accountName: 'BannerBank',
    departmentFilter: ['Commercial']
  };
</script>
```

**Single Department:**
```javascript
window.leverJobsOptions = {
  accountName: 'YourCompany',
  departmentFilter: ['Engineering']
};
```

**Multiple Departments:**
```javascript
window.leverJobsOptions = {
  accountName: 'YourCompany',
  departmentFilter: ['Engineering', 'Sales', 'Marketing']
};
```

**Show All Departments (default):**
```javascript
window.leverJobsOptions = {
  accountName: 'YourCompany'
  // No departmentFilter specified
};
```

## How It Works

### Data Flow

1. **API Request**: The script makes an XHR request to `https://api.lever.co/v0/postings/{accountName}?group=team&mode=json`

2. **Data Processing**: Jobs are organized into a hierarchical structure:
   - Department → Team → Individual Postings

3. **Department Filtering**: If `departmentFilter` is specified, only matching departments are included (case-insensitive matching)

4. **Rendering**: Jobs are rendered as HTML with data attributes for filtering:
   ```html
   <section class="lever-department" data-department="Engineering">
     <ul class="lever-team" data-team="Frontend">
       <li class="lever-job" data-department="Engineering" data-team="Frontend" data-location="Remote" data-work-type="Full-time">
         <a class="lever-job-title" href="...">Senior Frontend Engineer</a>
         <span class="lever-job-tag">Remote</span>
       </li>
     </ul>
   </section>
   ```

5. **Event Dispatch**: After rendering, a `leverJobsRendered` event is dispatched for additional processing (search, filters, etc.)

### Auto-Hiding Department Filter

When `departmentFilter` is defined in options:
- The script sets `window.leverDepartmentFilterActive = true`
- The department filter dropdown is automatically hidden in the UI
- Users can still filter by location, team, and work type

## API Reference

### Options Object

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `accountName` | String | Yes | Your Lever account name (company name in Lever) |
| `departmentFilter` | Array | No | Array of department names to filter by (case-insensitive) |

### Events

#### `leverJobsRendered`

Dispatched when jobs have been fetched and rendered to the DOM.

```javascript
window.addEventListener('leverJobsRendered', function() {
  console.log('Jobs have been rendered');
  // Perform additional operations here
});
```

### Global Variables

- `window.leverJobsOptions`: Configuration object for the Lever integration
- `window.leverDepartmentFilterActive`: Boolean indicating if department filtering is active

## HTML Structure

The rendered HTML follows this structure:

```html
<div id="lever-jobs-container">
  <section class="lever-department" data-department="Engineering">
    <h3 class="lever-department-title">Engineering</h3>
    <ul class="lever-team" data-team="Frontend">
      <li>
        <h4 class="lever-team-title">Frontend</h4>
        <ul>
          <li class="lever-job"
              data-department="Engineering"
              data-team="Frontend"
              data-location="Remote"
              data-work-type="Full-time">
            <a class="lever-job-title" href="[job URL]">Job Title</a>
            <span class="lever-job-tag">Remote</span>
          </li>
        </ul>
      </li>
    </ul>
  </section>
</div>
```

## CSS Classes

- `.lever-department`: Department section wrapper
- `.lever-department-title`: Department heading
- `.lever-team`: Team list container
- `.lever-team-title`: Team heading
- `.lever-job`: Individual job listing
- `.lever-job-title`: Job title link
- `.lever-job-tag`: Location tag

## Error Handling

If the API request fails:
- An error message is logged to the console
- A user-friendly error message is displayed: "Error fetching jobs."

## Browser Compatibility

Includes polyfills for older browsers (IE):
- `Array.prototype.findIndex`
- `CustomEvent`

## Example Implementation

See `index.html` for a complete working example with:
- Search functionality
- Filter dropdowns (location, department, team, work type)
- Clear filters button
- No results message
- Responsive design

## Tracking Parameters

The script automatically detects and preserves Lever tracking parameters in the URL:
- Format: `?lever-[parameter]`
- Example: `?lever-source=career-page`

## Security

- All user-generated content is sanitized using `sanitizeForHTML()` to prevent XSS attacks
- HTML special characters (`&`, `<`, `>`) are escaped

## License

This code is provided as-is for integration with the Lever Jobs API.