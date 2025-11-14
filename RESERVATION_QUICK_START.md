# Reservation & Escrow System - Quick Start Guide

## 🚀 Getting Started

### Installation
No additional dependencies needed! The reservation system uses existing packages.

```bash
npm install
npm run dev
```

## 📋 Quick Demo

### As a Student

1. **Login**
   - Email: `student@homigo.com`
   - Password: `password123`

2. **Reserve a Property**
   - Navigate to "Browse Properties"
   - Click on any property
   - Click "Reserve Property" button
   - Enter optional message
   - Confirm reservation

3. **View Reservations**
   - Go to "Reservations" in sidebar
   - See countdown timer (48 hours)
   - Filter by status (All, Active, Pending, etc.)

4. **Complete Payment**
   - Wait for landlord approval (or approve manually as landlord)
   - Click "Proceed to Payment"
   - Fill payment form
   - Submit to create escrow-protected booking

### As a Landlord

1. **Login**
   - Email: `landlord@homigo.com`
   - Password: `password123`

2. **View Requests**
   - Navigate to "Reservations" in sidebar
   - See pending reservation requests
   - Review student information

3. **Approve/Reject**
   - Click "Approve Reservation" to accept
   - Click "Decline Reservation" to reject
   - Provide rejection reason (optional)

4. **Track Status**
   - View processed requests
   - Monitor escrow payments in "Escrow Payments"

## 🎨 Key Features

### Reservation States

| State | Color | Icon | Actions Available |
|-------|-------|------|-------------------|
| Reserved – Pending | Yellow | Clock | Cancel |
| Approved | Green | CheckCircle | Proceed to Payment |
| Expired | Gray | AlertCircle | None |
| Rejected | Red | XCircle | None |

### Countdown Timer
- **Duration**: 48-72 hours
- **Display**: Days, Hours, Minutes, Seconds
- **Auto-expire**: Automatically marks as expired
- **Visual**: Gradient background with large numbers

### Escrow Protection
- **Held in Escrow**: Blue badge - Payment secured
- **Released**: Green badge - Paid to landlord
- **Refunded**: Purple badge - Returned to student
- **Pending**: Yellow badge - Awaiting payment

## 🔄 Complete Flow Example

### End-to-End Reservation Flow

```
1. Student reserves property
   ↓
2. Countdown timer starts (48h)
   ↓
3. Landlord receives notification
   ↓
4. Landlord reviews and approves
   ↓
5. Student sees "Proceed to Payment"
   ↓
6. Student submits payment
   ↓
7. Payment held in escrow
   ↓
8. Booking created
   ↓
9. Both parties see escrow status
```

## 📱 Navigation

### Student Portal
```
Dashboard
Browse Properties
Reservations ← NEW
My Bookings
Escrow Payments
Saved Listings
Messages
Settings
```

### Landlord Portal
```
Dashboard
My Properties
Add Property
Reservations ← NEW
Bookings
Escrow Payments
Messages
Settings
```

## 🎯 Testing Scenarios

### Scenario 1: Successful Reservation
1. Login as student
2. Browse and reserve property
3. Login as landlord (new tab)
4. Approve reservation
5. Back to student tab
6. Proceed to payment
7. Check "My Bookings" and "Escrow Payments"

### Scenario 2: Rejected Reservation
1. Login as student
2. Reserve property
3. Login as landlord
4. Reject with reason
5. Back to student tab
6. See rejection message

### Scenario 3: Expired Reservation
1. Login as student
2. View existing reservations
3. Wait for countdown to expire (or modify expiry date in code)
4. See "Expired" status

## 🛠️ Component Usage

### ReservationCard
```jsx
import ReservationCard from './components/ReservationCard'

<ReservationCard
  reservation={reservationObject}
  onCancel={handleCancel}
  onProceedToPayment={handlePayment}
/>
```

### CountdownTimer
```jsx
import CountdownTimer from './components/CountdownTimer'

<CountdownTimer
  expiryDate="2025-11-17T12:00:00Z"
  onExpire={handleExpire}
  compact={false}
/>
```

### EscrowStatusBadge
```jsx
import EscrowStatusBadge from './components/EscrowStatusBadge'

<EscrowStatusBadge status="Held in Escrow" />
```

## 💾 Data Structure

### Reservation Object
```javascript
{
  id: 1,
  propertyId: 1,
  propertyTitle: "Modern Studio near UP Diliman",
  propertyImage: "https://...",
  studentId: "student@homigo.com",
  studentName: "Demo Student",
  studentEmail: "student@homigo.com",
  studentPhone: "+63 917 123 4567",
  landlordId: "landlord@homigo.com",
  landlordName: "Demo Landlord",
  price: "₱8,500/month",
  status: "reserved", // or "approved", "rejected", "expired"
  reservedDate: "2025-11-15T10:00:00Z",
  expiryDate: "2025-11-17T10:00:00Z",
  message: "Hi! I'm interested in this property.",
  rejectionReason: "Optional rejection reason"
}
```

## 🎨 Styling Guide

### Colors
```javascript
// Status Colors
Reserved: 'bg-yellow-100 text-yellow-700'
Approved: 'bg-green-100 text-green-700'
Rejected: 'bg-red-100 text-red-700'
Expired: 'bg-gray-100 text-gray-700'

// Escrow Colors
Held: 'bg-blue-100 text-blue-700'
Released: 'bg-green-100 text-green-700'
Refunded: 'bg-purple-100 text-purple-700'
Pending: 'bg-yellow-100 text-yellow-700'
```

### Rounded Corners
```javascript
Cards: 'rounded-xl'
Buttons: 'rounded-lg'
Badges: 'rounded-full'
Images: 'rounded-lg'
```

### Shadows
```javascript
Cards: 'shadow-sm hover:shadow-md'
Modals: 'shadow-lg'
Buttons: 'hover:shadow-lg'
```

## 🔧 Customization

### Change Reservation Duration
Edit `src/context/ReservationContext.jsx`:
```javascript
// Change from 48 hours to 72 hours
const expiryDate = new Date(now.getTime() + 72 * 60 * 60 * 1000)
```

### Modify Timer Display
Edit `src/components/CountdownTimer.jsx`:
```javascript
// Add or remove time units
// Customize styling
// Change update frequency
```

### Update Status Colors
Edit component files to change badge colors:
```javascript
// In StatusBadge.jsx or EscrowStatusBadge.jsx
bg: 'bg-blue-100',
text: 'text-blue-700',
```

## 📊 Filter Options

### Student Reservations
- **All**: Show all reservations
- **Active**: Reserved or Approved
- **Pending**: Awaiting landlord response
- **Approved**: Ready for payment
- **Expired**: Time ran out
- **Rejected**: Declined by landlord

## 🔔 Notifications

### Toast Messages
- Reservation created
- Reservation cancelled
- Reservation approved
- Reservation rejected
- Payment submitted
- Escrow status updated

## 🎭 Demo Accounts

### Student Account
```
Email: student@homigo.com
Password: password123
```

### Landlord Account
```
Email: landlord@homigo.com
Password: password123
```

### Admin Account
```
Email: admin@homigo.com
Password: admin123
```

## 📝 Notes

- All data is stored in LocalStorage
- Timers run in real-time
- No backend required for demo
- Fully responsive design
- Works offline after initial load

## 🐛 Troubleshooting

### Timer not updating
- Check browser console for errors
- Ensure expiryDate is valid ISO string
- Verify component is mounted

### Reservation not showing
- Check LocalStorage in DevTools
- Verify user email matches reservation
- Clear LocalStorage and refresh

### Payment form not appearing
- Ensure reservation is approved
- Check console for errors
- Verify PaymentForm component exists

## 🚀 Next Steps

1. Test all user flows
2. Customize colors and styling
3. Add more dummy data
4. Integrate with backend (when ready)
5. Add email notifications
6. Implement real payment gateway

## 📚 Additional Resources

- Full Documentation: `RESERVATION_ESCROW_SYSTEM.md`
- Component API: See individual component files
- Context API: `src/context/ReservationContext.jsx`
- Styling Guide: Tailwind CSS documentation

---

**Happy Building! 🏠✨**
