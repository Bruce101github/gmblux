# Visitor Tracking Setup Guide

## Overview
This document explains how to set up and use the visitor tracking system that tracks site views and displays them in the admin dashboard chart.

## Setup Steps

### 1. Create Database Table
Run the SQL script in your Supabase SQL Editor:
```sql
-- File: create_visitor_tracking_table.sql
```
This creates:
- `visitor_tracking` table to store visitor data
- Indexes for fast queries
- RLS policies for security
- `increment_visitor_count()` function for tracking

### 2. How It Works

#### Client-Side Tracking
- **Location**: `client/src/hooks/useVisitorTracking.js`
- **Integration**: Automatically added to `client/src/App.jsx`
- **What it tracks**:
  - Device type (desktop, mobile, tablet)
  - Page path
  - Date of visit
- **When it tracks**: On every route change (page navigation)

#### Admin Dashboard Chart
- **Location**: `admin/src/components/ui/ChartAreaInteractive.tsx`
- **What it shows**:
  - Desktop vs Mobile visitors over time
  - Last 7 days, 30 days, or 90 days
  - Real-time data from database
- **Fallback**: Uses mock data if database is unavailable

## Database Schema

```sql
visitor_tracking
├── id (UUID, Primary Key)
├── date (DATE, NOT NULL)
├── device_type (TEXT, desktop/mobile/tablet)
├── page_path (TEXT, default '/')
├── visit_count (INTEGER, default 1)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)

UNIQUE(date, device_type, page_path)
```

## Features

### Automatic Tracking
- Tracks every page visit automatically
- Detects device type based on screen width
- Groups visits by date, device, and page
- Increments count for same day/device/page combinations

### Chart Features
- **Time Range Selection**: 7 days, 30 days, or 90 days
- **Device Breakdown**: Desktop vs Mobile (tablets grouped with mobile)
- **Real-time Updates**: Fetches latest data when time range changes
- **Loading State**: Shows loading indicator while fetching data
- **Error Handling**: Falls back to mock data if database query fails

## Usage

### Viewing Visitor Data
1. Go to Admin Dashboard
2. Scroll to the "Visitors" chart
3. Select time range (Last 7 days, 30 days, or 3 months)
4. View desktop and mobile visitor trends

### How Tracking Works
1. User visits any page on the site
2. `useVisitorTracking` hook detects:
   - Current page path
   - Device type (based on window width)
   - Current date
3. Calls `increment_visitor_count()` function
4. Database upserts the record (creates or increments count)
5. Chart fetches and displays aggregated data

## Device Detection

```javascript
- Mobile: width < 768px
- Tablet: width < 1024px (tracked as mobile in chart)
- Desktop: width >= 1024px
```

## Security

- **RLS Enabled**: Row Level Security is enabled
- **Public Insert**: Anyone can insert tracking data (for analytics)
- **Authenticated Read**: Only authenticated users (admins) can read data
- **No PII**: No personal information is stored (no IP, no user agent details)

## Troubleshooting

### Chart shows no data
1. Check if `visitor_tracking` table exists
2. Verify RLS policies are set correctly
3. Check browser console for errors
4. Ensure `increment_visitor_count()` function exists

### Tracking not working
1. Check browser console for errors
2. Verify Supabase client is configured correctly
3. Check network tab for failed requests
4. Ensure RLS policy allows inserts

### Data not updating
1. Clear browser cache
2. Check if visits are being tracked (query database directly)
3. Verify chart is fetching latest data (check network requests)

## Files Modified/Created

### Created:
- `create_visitor_tracking_table.sql` - Database setup script
- `client/src/hooks/useVisitorTracking.js` - Tracking hook
- `VISITOR_TRACKING_SETUP.md` - This documentation

### Modified:
- `client/src/App.jsx` - Added tracking hook
- `admin/src/components/ui/ChartAreaInteractive.tsx` - Connected to real data

## Next Steps (Optional Enhancements)

1. **Page-specific analytics**: Track which pages get most visits
2. **Referrer tracking**: Track where visitors come from
3. **Session tracking**: Track unique visitors vs page views
4. **Geographic data**: Track visitor locations (if needed)
5. **Export functionality**: Export visitor data to CSV
6. **Real-time updates**: Use Supabase real-time subscriptions for live updates

## Testing

1. Visit the site from different devices
2. Navigate between pages
3. Check admin dashboard chart
4. Verify data appears in database:
   ```sql
   SELECT * FROM visitor_tracking ORDER BY date DESC LIMIT 10;
   ```

