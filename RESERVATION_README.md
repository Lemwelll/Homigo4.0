# 🏠 Homigo Reservation & Escrow System

> A complete, production-ready front-end reservation and escrow UI flow for rental property management

[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0+-38B2AC.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 🌟 Overview

The Homigo Reservation & Escrow System is a comprehensive front-end solution that enables students to reserve rental properties with a time-limited hold (48-72 hours) while landlords review and approve requests. The system integrates seamlessly with escrow payment protection to ensure secure transactions.

### Key Features

✅ **Real-Time Countdown Timers** - Live 48-72 hour reservation holds  
✅ **Escrow Protection** - Secure payment holding system  
✅ **Dual Portal System** - Separate student and landlord interfaces  
✅ **Status Management** - Reserved, Approved, Rejected, Expired states  
✅ **Responsive Design** - Works on mobile, tablet, and desktop  
✅ **No Backend Required** - Fully functional with dummy data  
✅ **Modern UI** - Clean, professional design with Tailwind CSS  
✅ **Production Ready** - Can be deployed immediately  

---

## 📸 Screenshots

### Student Portal - Reservations
```
┌─────────────────────────────────────────────────────────┐
│  ⏰ My Reservations                                     │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Modern Studio near UP Diliman    [Reserved]      │  │
│  │ ⏰ Time Remaining: 48:00:00                       │  │
│  │ [Cancel Reservation]                              │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Landlord Portal - Requests
```
┌─────────────────────────────────────────────────────────┐
│  ⏰ Reservation Requests                                │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Student: Carlos Mendoza                           │  │
│  │ Property: Modern Studio                           │  │
│  │ ⏰ Expires in: 47:30:15                           │  │
│  │ [✓ Approve] [✗ Decline]                          │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/homigo.git

# Navigate to project directory
cd homigo

# Install dependencies
npm install

# Start development server
npm run dev
```

### Demo Accounts

```javascript
// Student Account
Email: student@homigo.com
Password: password123

// Landlord Account
Email: landlord@homigo.com
Password: password123

// Admin Account
Email: admin@homigo.com
Password: admin123
```

### Test the System

1. **Login as Student**
   - Browse properties
   - Click "Reserve Property"
   - Enter optional message
   - Confirm reservation

2. **Login as Landlord** (new tab)
   - Navigate to "Reservations"
   - Review student request
   - Approve or reject

3. **Back to Student**
   - See approval status
   - Proceed to payment
   - Complete escrow-protected booking

---

## 📁 Project Structure

```
src/
├── components/
│   ├── ReservationCard.jsx          # Individual reservation display
│   ├── CountdownTimer.jsx            # Real-time countdown
│   ├── EscrowStatusBadge.jsx         # Escrow status indicators
│   ├── LandlordRequestCard.jsx       # Landlord request view
│   ├── ReservationList.jsx           # List with filters
│   └── ...
│
├── pages/
│   ├── StudentReservations.jsx       # Student reservation page
│   ├── LandlordReservations.jsx      # Landlord request page
│   ├── PropertyDetails.jsx           # Property view with reserve
│   └── ...
│
├── context/
│   ├── ReservationContext.jsx        # Reservation state
│   ├── BookingContext.jsx            # Booking integration
│   └── EscrowContext.jsx             # Escrow integration
│
└── App.jsx                           # Main app with routes
```

---

## 🎨 Design System

### Color Palette

| Status | Color | Hex | Usage |
|--------|-------|-----|-------|
| Primary | Blue | `#3B82F6` | Buttons, links |
| Success | Green | `#10B981` | Approved states |
| Warning | Yellow | `#F59E0B` | Pending states |
| Error | Red | `#EF4444` | Rejected states |
| Info | Purple | `#8B5CF6` | Refunded states |

### Components

- **Cards**: White background, soft shadows, rounded corners
- **Buttons**: Primary blue, hover effects, smooth transitions
- **Badges**: Color-coded status indicators with icons
- **Timers**: Large numbers, gradient backgrounds
- **Modals**: Centered, overlay backdrop, smooth animations

---

## 🔄 Reservation Flow

```
Student Reserves Property
         ↓
48-Hour Timer Starts
         ↓
Landlord Reviews Request
         ↓
Approve or Reject
         ↓
[If Approved]
Student Proceeds to Payment
         ↓
Payment Held in Escrow
         ↓
Booking Created
```

---

## 📊 Reservation States

### Reserved - Pending Approval
- **Color**: Yellow
- **Icon**: Clock
- **Duration**: 48-72 hours
- **Actions**: Cancel reservation

### Reservation Approved
- **Color**: Green
- **Icon**: CheckCircle
- **Actions**: Proceed to payment

### Reservation Expired
- **Color**: Gray
- **Icon**: AlertCircle
- **Actions**: None (disabled)

### Reservation Rejected
- **Color**: Red
- **Icon**: XCircle
- **Reason**: Displayed to student

---

## 🛡️ Escrow Integration

### Payment States

| State | Badge Color | Description |
|-------|-------------|-------------|
| Pending | Yellow | Awaiting payment |
| Held in Escrow | Blue | Payment secured |
| Released | Green | Paid to landlord |
| Refunded | Purple | Returned to student |

### Security Features

- ✅ Payment held until confirmation
- ✅ Automatic refund on rejection
- ✅ Transparent status tracking
- ✅ Both parties notified

---

## 🎯 Key Components

### ReservationCard

```jsx
import ReservationCard from './components/ReservationCard'

<ReservationCard
  reservation={reservationObject}
  onCancel={handleCancel}
  onProceedToPayment={handlePayment}
/>
```

**Features:**
- Live countdown timer
- Status badges
- Property details
- Action buttons
- Responsive layout

### CountdownTimer

```jsx
import CountdownTimer from './components/CountdownTimer'

<CountdownTimer
  expiryDate="2025-11-17T12:00:00Z"
  onExpire={handleExpire}
  compact={false}
/>
```

**Features:**
- Real-time updates
- Days, hours, minutes, seconds
- Auto-expiration
- Compact mode available

### LandlordRequestCard

```jsx
import LandlordRequestCard from './components/LandlordRequestCard'

<LandlordRequestCard
  reservation={reservationObject}
  onApprove={handleApprove}
  onReject={handleReject}
/>
```

**Features:**
- Student information
- Property details
- Message display
- Countdown timer
- Approve/Reject buttons

---

## 🔌 API Reference

### ReservationContext

```javascript
const {
  reservations,              // Array of all reservations
  createReservation,         // Create new reservation
  approveReservation,        // Approve by landlord
  rejectReservation,         // Reject with reason
  cancelReservation,         // Cancel by student
  expireReservation,         // Mark as expired
  getStudentReservations,    // Get student's reservations
  getLandlordReservations,   // Get landlord's requests
  isPropertyReserved         // Check if property reserved
} = useReservation()
```

### Methods

#### createReservation(property, message)
Creates a new reservation with 48-hour hold.

```javascript
const reservation = createReservation(property, "I'm interested!")
```

#### approveReservation(reservationId)
Landlord approves reservation.

```javascript
approveReservation(123)
```

#### rejectReservation(reservationId, reason)
Landlord rejects with optional reason.

```javascript
rejectReservation(123, "Property no longer available")
```

---

## 📱 Responsive Design

### Mobile (< 640px)
- Single column layout
- Stacked buttons
- Compact timer
- Full-width cards

### Tablet (640px - 1024px)
- Two-column grid
- Side-by-side buttons
- Full timer display

### Desktop (> 1024px)
- Sidebar navigation
- Three-column grid
- Expanded cards
- All features visible

---

## 🧪 Testing

### Manual Testing Scenarios

1. **Complete Flow**
   - Reserve → Approve → Pay → Booking

2. **Rejection Flow**
   - Reserve → Reject → View reason

3. **Expiration Flow**
   - Reserve → Wait → Expire

4. **Cancellation Flow**
   - Reserve → Cancel

### Test Data

The system includes pre-populated dummy data:
- 5 sample reservations
- Various states (reserved, approved, rejected, expired)
- Realistic timestamps
- Sample messages

---

## 🔧 Configuration

### Change Reservation Duration

Edit `src/context/ReservationContext.jsx`:

```javascript
// Change from 48 hours to 72 hours
const expiryDate = new Date(now.getTime() + 72 * 60 * 60 * 1000)
```

### Customize Colors

Edit component files:

```javascript
// In StatusBadge.jsx
bg: 'bg-blue-100',
text: 'text-blue-700',
```

### Modify Timer Display

Edit `src/components/CountdownTimer.jsx`:

```javascript
// Add or remove time units
// Customize styling
// Change update frequency
```

---

## 📚 Documentation

- **[Full Documentation](RESERVATION_ESCROW_SYSTEM.md)** - Complete system guide
- **[Quick Start Guide](RESERVATION_QUICK_START.md)** - Get started quickly
- **[Component Showcase](RESERVATION_COMPONENTS_SHOWCASE.md)** - Visual reference
- **[System Diagrams](RESERVATION_SYSTEM_DIAGRAM.md)** - Architecture diagrams
- **[Implementation Summary](RESERVATION_IMPLEMENTATION_SUMMARY.md)** - What's built

---

## 🛠️ Technologies

- **React 18+** - UI framework
- **React Router DOM** - Navigation
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Vite** - Build tool
- **LocalStorage** - Data persistence

---

## ✨ Features Checklist

### Reservation System
- [x] Reserve property button
- [x] Reservation modal
- [x] 48-72 hour countdown
- [x] Auto-expiration
- [x] Cancel functionality
- [x] Landlord approval/rejection
- [x] Status badges
- [x] Filter tabs

### Escrow Integration
- [x] Payment form
- [x] Escrow status badges
- [x] Booking creation
- [x] Payment holding
- [x] Release/refund logic
- [x] Status tracking

### UI/UX
- [x] Responsive design
- [x] Toast notifications
- [x] Modal dialogs
- [x] Loading states
- [x] Empty states
- [x] Smooth animations
- [x] Hover effects

### Documentation
- [x] Full system docs
- [x] Quick start guide
- [x] Component showcase
- [x] Visual diagrams
- [x] Implementation summary

---

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Vercel

```bash
vercel deploy
```

### Deploy to Netlify

```bash
netlify deploy --prod
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

---

## 🙏 Acknowledgments

- Built with React and Tailwind CSS
- Icons by Lucide React
- Inspired by modern rental platforms

---

## 📞 Support

For questions or issues:
- Check the documentation files
- Review the quick start guide
- Test with demo accounts
- Check component showcase

---

## 🎉 What's Next?

### Future Enhancements
- [ ] Backend API integration
- [ ] Real-time notifications
- [ ] Email/SMS alerts
- [ ] Payment gateway integration
- [ ] Document upload
- [ ] Video tours
- [ ] Chat system
- [ ] Review system

---

**Built with ❤️ for Homigo - Making rental property management simple and secure!**

🏠 **Happy Renting!** ✨
