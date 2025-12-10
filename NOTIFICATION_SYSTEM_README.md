# Admin Notification System

A comprehensive notification system for the admin panel that alerts administrators about important events in real-time.

## Features

- ✅ Real-time notifications using Supabase real-time subscriptions
- ✅ Automatic notification creation via database triggers
- ✅ Notification bell with unread count badge
- ✅ Dropdown notification panel
- ✅ Full notifications page with filtering
- ✅ Mark as read / Mark all as read functionality

## Setup Instructions

### 1. Database Setup

Run the SQL file in your Supabase SQL Editor:
```sql
-- Run: notifications_schema.sql
```

This will create:
- `notifications` table
- Database triggers for automatic notification creation
- Indexes for performance
- Row Level Security policies

### 2. Notification Types

The system automatically creates notifications for:

1. **New Booking Requests** (`booking`)
   - Triggered when a user submits a booking request
   - Shows: "A new [request_type] request has been submitted by [name]"

2. **Contact Inquiries** (`contact_inquiry`)
   - Triggered when someone provides contact info to call or WhatsApp
   - Shows: "[Name] has [called/contacted via WhatsApp] about a property"

3. **New Properties** (`property_added`) - Optional
   - Can be enabled by uncommenting the trigger in the SQL file
   - Shows: "A new property has been added: [property title]"

### 3. Components Created

#### NotificationBell Component
- Located at: `admin/src/components/NotificationBell.jsx`
- Displays bell icon with unread count badge
- Opens/closes notification panel
- Real-time updates via Supabase subscriptions

#### NotificationsPanel Component
- Located at: `admin/src/components/NotificationsPanel.jsx`
- Dropdown panel showing recent notifications
- Click to navigate to related pages
- Mark individual or all notifications as read

#### Notifications Page
- Located at: `admin/src/pages/Notifications.jsx`
- Full page view of all notifications
- Filter by status (all/unread/read) and type
- Mark all as read functionality

### 4. Integration

The notification bell has been integrated into:
- **DashboardLayout** (`admin/src/layouts/DashboardLayouts.jsx`)
  - Desktop: Top right corner
  - Mobile: Next to menu toggle

- **App Routes** (`admin/src/App.jsx`)
  - Added route: `/notifications`

## How It Works

### Automatic Notification Creation

Database triggers automatically create notifications when:

1. **Booking Created** → `trigger_new_booking`
   - Fires on INSERT into `booking` table
   - Creates notification with booking details

2. **Contact Inquiry Created** → `trigger_new_contact_inquiry`
   - Fires on INSERT into `contact_inquiries` table
   - Creates notification with contact details

### Real-Time Updates

The NotificationBell component subscribes to:
- `INSERT` events on `notifications` table (new notifications)
- `UPDATE` events on `notifications` table (read status changes)

When a new notification is created, it automatically appears in the bell without page refresh.

### Notification Structure

Each notification contains:
- `type`: booking, contact_inquiry, property_added, error
- `title`: Short title
- `message`: Detailed message
- `related_id`: ID of related record (booking.id, contact_inquiries.id, etc.)
- `related_type`: Type of related record
- `is_read`: Boolean flag
- `created_at`: Timestamp
- `read_at`: Timestamp when marked as read

## Usage

### For Admins

1. **View Notifications**
   - Click the bell icon in the top right
   - See recent notifications in dropdown
   - Click "View all notifications" for full page

2. **Mark as Read**
   - Click on a notification to mark it as read
   - Use "Mark all as read" button to clear all

3. **Filter Notifications**
   - On the notifications page, filter by:
     - Status: All, Unread, Read
     - Type: All, Bookings, Contact Inquiries, Properties

### For Developers

#### Adding New Notification Types

1. Add new type to CHECK constraint in SQL:
```sql
CHECK (type IN ('booking', 'contact_inquiry', 'property_added', 'error', 'your_new_type'))
```

2. Add icon and color to `NotificationsPanel.jsx`:
```javascript
const typeIcons = {
  your_new_type: YourIcon,
};

const typeColors = {
  your_new_type: "text-yellow-400",
};
```

3. Create trigger function if needed:
```sql
CREATE OR REPLACE FUNCTION notify_your_event()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO notifications (type, title, message, related_id, related_type)
  VALUES ('your_new_type', 'Title', 'Message', NEW.id, 'your_table');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

## Database Schema

```sql
notifications
├── id (UUID, Primary Key)
├── type (TEXT) - booking, contact_inquiry, property_added, error
├── title (TEXT)
├── message (TEXT)
├── related_id (UUID) - Foreign key to related record
├── related_type (TEXT) - Type of related record
├── is_read (BOOLEAN, default: false)
├── created_at (TIMESTAMPTZ)
└── read_at (TIMESTAMPTZ)
```

## Security

- Row Level Security (RLS) enabled
- Only authenticated users can read/update notifications
- Public users can insert (via triggers only)

## Performance

- Indexes on:
  - `is_read` (for filtering unread)
  - `created_at` (for sorting)
  - `type` (for filtering by type)

## Future Enhancements

Potential additions:
- Email notifications for critical events
- Notification preferences per admin
- Notification sounds
- Push notifications (if using PWA)
- Notification grouping
- Archive old notifications
