# Reservation System - Component Showcase

## 🎨 Visual Component Guide

This document showcases all the UI components in the Reservation & Escrow system with visual descriptions and usage examples.

---

## 1. ReservationCard Component

### Visual Design
```
┌─────────────────────────────────────────────────────────────┐
│  ┌────────┐  Modern Studio near UP Diliman    [Reserved]   │
│  │        │                                    [Escrow]     │
│  │ Image  │  Landlord: Maria Santos                        │
│  │        │  Reserved: Nov 15, 2025                        │
│  └────────┘  Price: ₱8,500/month                           │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  ⏰ Time Remaining                                    │  │
│  │  ┌──┐   ┌──┐   ┌──┐   ┌──┐                          │  │
│  │  │48│ : │00│ : │00│ : │00│                          │  │
│  │  └──┘   └──┘   └──┘   └──┘                          │  │
│  │  Hours  Minutes Seconds                               │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  [Cancel Reservation]                                       │
└─────────────────────────────────────────────────────────────┘
```

### States

#### Reserved - Pending
- **Background**: White with soft shadow
- **Timer**: Yellow gradient background
- **Badge**: Yellow with clock icon
- **Actions**: Cancel button

#### Approved
- **Background**: White with soft shadow
- **Message**: Green success banner
- **Badge**: Green with checkmark icon
- **Actions**: "Proceed to Payment" button (primary blue)

#### Expired
- **Background**: White with soft shadow
- **Message**: Gray informational banner
- **Badge**: Gray with alert icon
- **Actions**: None (disabled state)

#### Rejected
- **Background**: White with soft shadow
- **Message**: Red error banner with reason
- **Badge**: Red with X icon
- **Actions**: None

---

## 2. CountdownTimer Component

### Full Display Mode
```
┌────────────────────────────────────────────┐
│  ┌──────┐   ┌──────┐   ┌──────┐   ┌──────┐│
│  │  48  │ : │  00  │ : │  00  │ : │  00  ││
│  │Hours │   │ Min  │   │ Sec  │   │      ││
│  └──────┘   └──────┘   └──────┘   └──────┘│
└────────────────────────────────────────────┘
```

### Compact Display Mode
```
⏰ 48h 0m 0s
```

### Features
- Real-time updates every second
- Automatic expiration handling
- Gradient background (yellow to orange)
- Large, bold numbers
- Clear labels

---

## 3. LandlordRequestCard Component

### Visual Design
```
┌─────────────────────────────────────────────────────────────────┐
│  ┌──────────┐  Modern Studio near UP Diliman  [Pending Approval]│
│  │          │  ₱8,500/month                                      │
│  │  Image   │                                                    │
│  │          │  ┌──────────────────────────────────────────┐     │
│  │  (Large) │  │ 👤 Student Information                   │     │
│  │          │  │ Carlos Mendoza                           │     │
│  └──────────┘  │ 📧 carlos.mendoza@email.com             │     │
│                │ 📞 +63 921 567 8901                      │     │
│                │ 📅 Reserved on Nov 15, 2025              │     │
│                └──────────────────────────────────────────┘     │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ 💬 Student's Message                                     │  │
│  │ "I'm a graduate student at DLSU. Looking for a quiet    │  │
│  │  place to study."                                        │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ ⏰ Reservation Expires In                                │  │
│  │ [Countdown Timer Display]                                │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  [✓ Approve Reservation]  [✗ Decline Reservation]              │
└─────────────────────────────────────────────────────────────────┘
```

### Color Scheme
- **Card**: White background, gray border
- **Student Info**: Light gray background
- **Message**: Light blue background
- **Timer**: Yellow gradient
- **Approve Button**: Green
- **Decline Button**: Red

---

## 4. EscrowStatusBadge Component

### Badge Variations

#### Held in Escrow
```
┌──────────────────────┐
│ 🛡️ Escrow Protected │  (Blue)
└──────────────────────┘
```

#### Payment Released
```
┌──────────────────────┐
│ ✓ Payment Released   │  (Green)
└──────────────────────┘
```

#### Payment Refunded
```
┌──────────────────────┐
│ ↩️ Payment Refunded  │  (Purple)
└──────────────────────┘
```

#### Payment Pending
```
┌──────────────────────┐
│ ⏰ Payment Pending   │  (Yellow)
└──────────────────────┘
```

---

## 5. ReservationList Component

### Visual Layout
```
┌─────────────────────────────────────────────────────────┐
│  🔍 Filter Reservations                                 │
│  [All] [Active] [Pending] [Approved] [Expired] [Rejected]│
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  [ReservationCard 1]                                    │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  [ReservationCard 2]                                    │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  [ReservationCard 3]                                    │
└─────────────────────────────────────────────────────────┘
```

### Filter Tabs
- **Active Tab**: Primary blue background, white text
- **Inactive Tab**: Light gray background, dark text
- **Hover**: Slightly darker gray

---

## 6. Reserve Property Modal

### Visual Design
```
┌─────────────────────────────────────────────────────┐
│  Reserve Property                              [X]  │
├─────────────────────────────────────────────────────┤
│                                                      │
│  ┌────────────────────────────────────────────┐    │
│  │         [Property Image]                   │    │
│  └────────────────────────────────────────────┘    │
│                                                      │
│  Modern Studio near UP Diliman                      │
│  ₱8,500/month                                       │
│                                                      │
│  ┌──────────────────────────────────────────┐      │
│  │ ⏰ 48-Hour Reservation                   │      │
│  │ This property will be held for you for   │      │
│  │ 48 hours. Complete payment within this   │      │
│  │ time to secure your booking.             │      │
│  └──────────────────────────────────────────┘      │
│                                                      │
│  Message to Landlord (Optional)                     │
│  ┌──────────────────────────────────────────┐      │
│  │                                           │      │
│  │  [Text area for message]                 │      │
│  │                                           │      │
│  └──────────────────────────────────────────┘      │
│                                                      │
│  [Cancel]  [Confirm Reservation]                    │
└─────────────────────────────────────────────────────┘
```

### Features
- **Overlay**: Semi-transparent black background
- **Modal**: White, rounded corners, centered
- **Image**: Full-width, rounded
- **Info Box**: Yellow background with clock icon
- **Buttons**: Gray cancel, blue confirm

---

## 7. Payment Form Modal (Integrated)

### Visual Design
```
┌─────────────────────────────────────────────────────┐
│  Secure Payment                                [X]  │
│  Complete payment to hold booking in escrow         │
├─────────────────────────────────────────────────────┤
│                                                      │
│  ┌──────────────────────────────────────────┐      │
│  │ 🛡️ Escrow Protected Payment             │      │
│  │ Your payment will be securely held until │      │
│  │ the landlord approves your booking       │      │
│  │                                           │      │
│  │ Modern Studio near UP Diliman            │      │
│  │ ₱8,500                                   │      │
│  └──────────────────────────────────────────┘      │
│                                                      │
│  Select Payment Method                              │
│  ┌──────────────┐  ┌──────────────┐               │
│  │ 💳 Credit/   │  │ 🏦 Bank      │               │
│  │ Debit Card   │  │ Transfer     │               │
│  └──────────────┘  └──────────────┘               │
│                                                      │
│  [Payment form fields]                              │
│                                                      │
│  [🛡️ Submit Payment & Hold in Escrow]              │
└─────────────────────────────────────────────────────┘
```

---

## 8. Status Badge Component

### Badge Variations

#### Pending
```
┌──────────────┐
│ ⏰ Pending  │  (Yellow)
└──────────────┘
```

#### Approved
```
┌──────────────┐
│ ✓ Approved  │  (Green)
└──────────────┘
```

#### Rejected
```
┌──────────────┐
│ ✗ Rejected  │  (Red)
└──────────────┘
```

---

## 9. Student Reservations Page

### Page Layout
```
┌─────────────────────────────────────────────────────────┐
│  [Sidebar]  │  ⏰ My Reservations                       │
│             │  Manage your property reservations and    │
│  Dashboard  │  proceed to payment when approved         │
│  Browse     │                                            │
│ >Reservations│  ┌──────────────────────────────────┐   │
│  Bookings   │  │ 🔍 Filter Reservations           │   │
│  Escrow     │  │ [All][Active][Pending]...        │   │
│  Favorites  │  └──────────────────────────────────┘   │
│  Messages   │                                            │
│  Settings   │  ┌──────────────────────────────────┐   │
│             │  │ [ReservationCard - Reserved]     │   │
│             │  └──────────────────────────────────┘   │
│             │                                            │
│             │  ┌──────────────────────────────────┐   │
│             │  │ [ReservationCard - Approved]     │   │
│             │  └──────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

---

## 10. Landlord Reservations Page

### Page Layout
```
┌─────────────────────────────────────────────────────────┐
│  [Sidebar]  │  ⏰ Reservation Requests                  │
│             │  Review and respond to property           │
│  Dashboard  │  reservation requests from students       │
│  Properties │                                            │
│  Add        │  ⏰ Pending Requests (2)                  │
│ >Reservations│  ┌──────────────────────────────────┐   │
│  Bookings   │  │ [LandlordRequestCard]            │   │
│  Escrow     │  │ - Student info                   │   │
│  Messages   │  │ - Message                        │   │
│  Settings   │  │ - Timer                          │   │
│             │  │ [Approve] [Decline]              │   │
│             │  └──────────────────────────────────┘   │
│             │                                            │
│             │  ✓ Processed Requests (3)                │
│             │  ┌──────────────────────────────────┐   │
│             │  │ [Processed Reservation Cards]    │   │
│             │  └──────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

---

## Color Reference

### Status Colors
| Status | Background | Text | Border |
|--------|-----------|------|--------|
| Reserved | `bg-yellow-100` | `text-yellow-700` | `border-yellow-200` |
| Approved | `bg-green-100` | `text-green-700` | `border-green-200` |
| Rejected | `bg-red-100` | `text-red-700` | `border-red-200` |
| Expired | `bg-gray-100` | `text-gray-700` | `border-gray-200` |

### Escrow Colors
| Status | Background | Text | Border |
|--------|-----------|------|--------|
| Held | `bg-blue-100` | `text-blue-700` | `border-blue-200` |
| Released | `bg-green-100` | `text-green-700` | `border-green-200` |
| Refunded | `bg-purple-100` | `text-purple-700` | `border-purple-200` |
| Pending | `bg-yellow-100` | `text-yellow-700` | `border-yellow-200` |

### Button Colors
| Type | Background | Hover | Text |
|------|-----------|-------|------|
| Primary | `bg-primary-600` | `bg-primary-700` | `text-white` |
| Success | `bg-green-600` | `bg-green-700` | `text-white` |
| Danger | `bg-red-600` | `bg-red-700` | `text-white` |
| Secondary | `bg-gray-100` | `bg-gray-200` | `text-gray-700` |

---

## Spacing & Sizing

### Card Spacing
- **Padding**: `p-6` (24px)
- **Gap**: `gap-4` (16px)
- **Margin Bottom**: `mb-4` (16px)

### Border Radius
- **Cards**: `rounded-xl` (12px)
- **Buttons**: `rounded-lg` (8px)
- **Badges**: `rounded-full`
- **Images**: `rounded-lg` (8px)

### Shadows
- **Default**: `shadow-sm`
- **Hover**: `shadow-md`
- **Modal**: `shadow-lg`

---

## Responsive Breakpoints

### Mobile (< 640px)
- Single column layout
- Full-width cards
- Stacked buttons
- Compact timer display

### Tablet (640px - 1024px)
- Two-column grid
- Side-by-side buttons
- Full timer display

### Desktop (> 1024px)
- Sidebar + content layout
- Three-column grid (where applicable)
- Expanded cards
- Full feature display

---

## Animation & Transitions

### Hover Effects
```css
transition-all duration-300
hover:shadow-md
hover:scale-105
```

### Button Animations
```css
transition-colors duration-200
hover:bg-primary-700
```

### Modal Animations
```css
fade-in animation
backdrop blur effect
```

### Timer Updates
```css
Real-time updates every 1000ms
Smooth number transitions
```

---

## Accessibility Features

### Keyboard Navigation
- Tab through all interactive elements
- Enter to activate buttons
- Escape to close modals

### Screen Reader Support
- ARIA labels on all icons
- Descriptive button text
- Status announcements

### Color Contrast
- WCAG AA compliant
- Minimum 4.5:1 ratio
- Clear visual hierarchy

---

## Icon Reference

| Icon | Component | Usage |
|------|-----------|-------|
| ⏰ Clock | CountdownTimer | Time-related features |
| ✓ CheckCircle | StatusBadge | Approved/Success states |
| ✗ XCircle | StatusBadge | Rejected/Error states |
| ⚠️ AlertCircle | StatusBadge | Warning/Expired states |
| 🛡️ Shield | EscrowBadge | Security/Protection |
| 👤 User | RequestCard | Student information |
| 📧 Mail | RequestCard | Email address |
| 📞 Phone | RequestCard | Phone number |
| 📅 Calendar | RequestCard | Date information |
| 💬 MessageSquare | RequestCard | Messages |
| 🏠 Home | Various | Property-related |

---

## Best Practices

### Component Usage
1. Always provide required props
2. Handle loading states
3. Show error messages clearly
4. Use consistent spacing
5. Follow color conventions

### Performance
1. Memoize expensive calculations
2. Use React.memo for pure components
3. Optimize timer updates
4. Lazy load images

### User Experience
1. Clear call-to-action buttons
2. Informative error messages
3. Loading indicators
4. Success confirmations
5. Smooth transitions

---

**This showcase provides a complete visual reference for all reservation system components!** 🎨✨
