# Homigo Reservation & Escrow System

## Overview
Complete front-end reservation and escrow UI flow for both Student Portal and Landlord Portal. Built with React + Tailwind CSS featuring clean UI, rounded corners, soft shadows, and modern design.

## System Architecture

### 1. Reservation System Flow

#### Student Journey
1. **Browse Properties** → Student views property details
2. **Reserve Property** → Click "Reserve Property" button
3. **Reservation Modal** → Enter optional message to landlord
4. **Confirmation** → Property held for 48-72 hours
5. **Countdown Timer** → Visual timer shows time remaining
6. **Landlord Response** → Wait for approval/rejection
7. **Payment** → If approved, proceed to payment
8. **Booking Created** → Escrow protection activated

#### Landlord Journey
1. **Receive Request** → Notification of new reservation
2. **Review Details** → View student info and message
3. **Countdown Timer** → See time remaining to respond
4. **Approve/Reject** → Make decision
5. **Escrow Management** → Track payment status

### 2. Reservation States

#### Reserved – Pending Approval
- **Badge Color**: Yellow (bg-yellow-100, text-yellow-700)
- **Icon**: Clock
- **Features**:
  - Live countdown timer (48-72 hours)
  - Cancel reservation option
  - Property held exclusively
  - Landlord notification sent

#### Reservation Approved
- **Badge Color**: Green (bg-green-100, text-green-700)
- **Icon**: CheckCircle
- **Features**:
  - "Proceed to Payment" CTA button
  - Escrow payment form
  - Booking confirmation

#### Reservation Expired
- **Badge Color**: Gray (bg-gray-100, text-gray-700)
- **Icon**: AlertCircle
- **Features**:
  - Disabled actions
  - Property released back to market
  - Informational message

#### Reservation Rejected
- **Badge Color**: Red (bg-red-100, text-red-700)
- **Icon**: XCircle
- **Features**:
  - Rejection reason displayed
  - Property available for re-reservation
  - Notification to student

## Components

### Core Components

#### 1. ReservationCard
**Location**: `src/components/ReservationCard.jsx`

**Props**:
- `reservation` - Reservation object
- `onCancel` - Cancel handler
- `onProceedToPayment` - Payment handler

**Features**:
- Live countdown timer
- Status badges
- Property image and details
- Action buttons based on status
- Responsive design

#### 2. CountdownTimer
**Location**: `src/components/CountdownTimer.jsx`

**Props**:
- `expiryDate` - ISO date string
- `onExpire` - Callback when timer expires
- `compact` - Boolean for compact display

**Features**:
- Real-time countdown
- Days, hours, minutes, seconds
- Auto-expire functionality
- Compact and full display modes

#### 3. LandlordRequestCard
**Location**: `src/components/LandlordRequestCard.jsx`

**Props**:
- `reservation` - Reservation object
- `onApprove` - Approve handler
- `onReject` - Reject handler

**Features**:
- Student information display
- Property details
- Message from student
- Countdown timer
- Approve/Reject buttons

#### 4. ReservationList
**Location**: `src/components/ReservationList.jsx`

**Props**:
- `reservations` - Array of reservations
- `onCancel` - Cancel handler
- `onProceedToPayment` - Payment handler

**Features**:
- Filter tabs (All, Active, Pending, Approved, Expired, Rejected)
- Responsive grid layout
- Empty state handling

#### 5. EscrowStatusBadge
**Location**: `src/components/EscrowStatusBadge.jsx`

**Props**:
- `status` - Escrow status string

**Status Types**:
- **Held in Escrow** - Blue badge with Shield icon
- **Payment Released** - Green badge with CheckCircle icon
- **Payment Refunded** - Purple badge with XCircle icon
- **Payment Pending** - Yellow badge with Clock icon

### Page Components

#### 1. StudentReservations
**Location**: `src/pages/StudentReservations.jsx`
**Route**: `/student/reservations`

**Features**:
- View all reservations
- Filter by status
- Cancel reservations
- Proceed to payment for approved reservations
- Integration with PaymentForm

#### 2. LandlordReservations
**Location**: `src/pages/LandlordReservations.jsx`
**Route**: `/landlord/reservations`

**Features**:
- Pending requests section
- Processed requests section
- Approve/Reject functionality
- Student information display
- Countdown timers

#### 3. PropertyDetails (Updated)
**Location**: `src/pages/PropertyDetails.jsx`

**New Features**:
- "Reserve Property" button
- Reservation modal with message input
- 48-hour hold notification
- Integration with ReservationContext

## Context & State Management

### ReservationContext
**Location**: `src/context/ReservationContext.jsx`

**State**:
```javascript
{
  id: number,
  propertyId: number,
  propertyTitle: string,
  propertyImage: string,
  studentId: string,
  studentName: string,
  studentEmail: string,
  studentPhone: string,
  landlordId: string,
  landlordName: string,
  price: string,
  status: 'reserved' | 'approved' | 'rejected' | 'expired',
  reservedDate: ISO string,
  expiryDate: ISO string,
  message: string,
  rejectionReason?: string
}
```

**Methods**:
- `createReservation(property, message)` - Create new reservation
- `approveReservation(reservationId)` - Approve reservation
- `rejectReservation(reservationId, reason)` - Reject with reason
- `cancelReservation(reservationId)` - Cancel reservation
- `expireReservation(reservationId)` - Mark as expired
- `getStudentReservations()` - Get student's reservations
- `getLandlordReservations()` - Get landlord's reservations
- `isPropertyReserved(propertyId)` - Check if property is reserved

**Storage**: LocalStorage (`homigoReservations`)

## Escrow Integration

### Payment Flow
1. **Reservation Approved** → Student sees "Proceed to Payment"
2. **Payment Form** → Student enters payment details
3. **Escrow Created** → Payment held in escrow
4. **Booking Created** → Booking record created
5. **Status Updates** → Both parties see escrow status

### Escrow States
- **Pending** - Payment not yet submitted
- **Held in Escrow** - Payment secured, awaiting confirmation
- **Released** - Payment released to landlord
- **Refunded** - Payment returned to student

## UI/UX Design

### Color Palette
- **Primary Blue**: `#3B82F6` - Trust and security
- **Success Green**: `#10B981` - Approved/Released
- **Warning Yellow**: `#F59E0B` - Pending/Reserved
- **Error Red**: `#EF4444` - Rejected/Expired
- **Neutral Gray**: `#6B7280` - Expired/Disabled
- **Purple**: `#8B5CF6` - Refunded

### Design Principles
- **Rounded Corners**: `rounded-lg`, `rounded-xl`
- **Soft Shadows**: `shadow-sm`, `shadow-md`, `shadow-lg`
- **Smooth Transitions**: `transition-all duration-300`
- **Responsive**: Mobile-first design
- **Accessible**: ARIA labels and keyboard navigation

### Typography
- **Headings**: Bold, clear hierarchy
- **Body**: Readable, comfortable line-height
- **Status Text**: Medium weight, color-coded

## Navigation Updates

### Student Sidebar
- Dashboard
- Browse Properties
- **Reservations** ← NEW
- My Bookings
- Escrow Payments
- Saved Listings
- Messages
- Settings

### Landlord Sidebar
- Dashboard
- My Properties
- Add Property
- **Reservations** ← NEW
- Bookings
- Escrow Payments
- Messages
- Settings

## Dummy Data

### Sample Reservations
The system includes pre-populated dummy data for demonstration:
- 5 sample reservations with various states
- Mix of student and landlord perspectives
- Realistic timestamps and expiry dates
- Sample messages and rejection reasons

### Data Persistence
- LocalStorage for client-side persistence
- Survives page refreshes
- Separate storage keys for reservations and bookings

## Testing Scenarios

### Student Flow
1. Login as student (`student@homigo.com`)
2. Browse properties
3. Click "Reserve Property"
4. Enter message and confirm
5. View in Reservations page
6. Watch countdown timer
7. Wait for landlord approval
8. Proceed to payment when approved

### Landlord Flow
1. Login as landlord (`landlord@homigo.com`)
2. Navigate to Reservations
3. View pending requests
4. Review student information
5. Approve or reject reservation
6. View processed requests

## Technical Implementation

### Dependencies
- React 18+
- React Router DOM
- Tailwind CSS
- Lucide React (icons)

### Key Features
- Real-time countdown timers
- Automatic expiration handling
- Responsive design
- Toast notifications
- Modal dialogs
- Filter functionality
- Status badges
- Escrow integration

### Performance
- Efficient re-renders with React hooks
- LocalStorage for persistence
- Optimized timer updates
- Lazy loading where applicable

## Future Enhancements

### Potential Features
- Email notifications
- SMS alerts
- Push notifications
- Calendar integration
- Payment gateway integration
- Document upload
- Video tours
- Chat integration
- Review system
- Dispute resolution

### Backend Integration
When ready to connect to backend:
1. Replace LocalStorage with API calls
2. Add WebSocket for real-time updates
3. Implement authentication tokens
4. Add server-side validation
5. Set up payment processing
6. Configure email/SMS services

## Accessibility

### WCAG Compliance
- Semantic HTML
- ARIA labels
- Keyboard navigation
- Color contrast ratios
- Screen reader support
- Focus indicators

### Mobile Responsiveness
- Touch-friendly buttons
- Responsive layouts
- Mobile-optimized modals
- Swipe gestures support

## Security Considerations

### Client-Side
- Input validation
- XSS prevention
- CSRF protection (when backend added)
- Secure payment forms
- Data sanitization

### Best Practices
- No sensitive data in LocalStorage
- Encrypted payment information
- Secure communication protocols
- Regular security audits

## Support & Documentation

### User Guides
- Student reservation guide
- Landlord approval guide
- Payment process guide
- Escrow system explanation

### Developer Notes
- Component documentation
- Context API usage
- State management patterns
- Styling conventions

## Conclusion

This reservation and escrow system provides a complete, production-ready UI flow for the Homigo platform. It features modern design, intuitive user experience, and seamless integration with existing booking and escrow systems. All components are modular, reusable, and follow React best practices.
