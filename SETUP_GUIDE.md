# Homigo Platform - Quick Setup Guide

## Installation Steps

### 1. Install Dependencies
Open your terminal in the project directory and run:
```bash
npm install
```

This will install:
- React 18.2.0
- React Router DOM 6.20.0
- Lucide React (icons)
- Tailwind CSS 3.3.6
- Vite 5.0.7

### 2. Start Development Server
```bash
npm run dev
```

The application will start at `http://localhost:5173`

### 3. Navigate the Platform

#### Landing Page (/)
- Hero section with search bar
- Two main cards: "I'm looking for a rent" and "I want to post my rental property"
- Features section
- Footer with links

#### Student Flow
1. Click "I'm looking for a rent" or navigate to `/student/register`
2. Fill out registration form with student ID upload
3. Login at `/student/login`
4. Access dashboard at `/student/dashboard` to browse properties
5. Click any property to view details at `/property/:id`

#### Landlord Flow
1. Click "I want to post my rental property" or navigate to `/landlord/register`
2. Fill out registration form with government ID upload
3. Login at `/landlord/login`
4. Access dashboard at `/landlord/dashboard` to manage properties
5. Click "Add Property" to list new properties

#### Admin Flow
1. Navigate to `/admin`
2. Review pending verifications
3. Approve or reject landlords and properties

## Key Features Implemented

### Design Elements
- Modern gradient backgrounds (blue/green palette)
- Rounded corners and soft shadows
- Smooth hover animations
- Responsive grid layouts
- Mobile-first design

### Components
- **Navbar**: Sticky navigation with login/logout
- **Sidebar**: Different navigation for students vs landlords
- **PropertyCard**: Reusable card with property info
- **HeroSection**: Eye-catching landing section
- **DashboardLayout**: Shared layout for authenticated pages

### Pages
- Landing page with hero and user type selection
- Separate login/register for students and landlords
- Student dashboard with search and filters
- Landlord dashboard with property management
- Admin verification dashboard
- Detailed property view page

## Color Scheme

### Primary (Blue)
- Used for student-related elements
- Conveys trust and reliability
- Shades from 50 to 900

### Secondary (Green)
- Used for landlord-related elements
- Represents growth and safety
- Shades from 50 to 900

## Responsive Breakpoints

- Mobile: < 768px (stacked layouts)
- Tablet: 768px - 1024px (2-column grids)
- Desktop: > 1024px (3-column grids)

## Customization Tips

### Change Colors
Edit `tailwind.config.js`:
```javascript
colors: {
  primary: {
    500: '#0073e6', // Change this
  }
}
```

### Add New Pages
1. Create file in `src/pages/`
2. Add route in `src/App.jsx`
3. Import and use components

### Modify Layouts
- Edit `src/components/DashboardLayout.jsx` for dashboard structure
- Edit `src/components/Navbar.jsx` for navigation
- Edit `src/components/Sidebar.jsx` for side menu

## Testing the UI

### Test Student Flow
1. Go to `/student/register`
2. Fill form and submit
3. Redirects to `/student/dashboard`
4. Browse properties with filters
5. Click property to view details

### Test Landlord Flow
1. Go to `/landlord/register`
2. Fill form and submit
3. Redirects to `/landlord/dashboard`
4. View property statistics
5. Manage existing properties

### Test Admin Flow
1. Go to `/admin`
2. View pending verifications
3. Click Approve/Reject buttons
4. Items disappear from list

## Build for Production

```bash
npm run build
```

Output will be in `dist/` folder, ready for deployment.

## Troubleshooting

### Port Already in Use
If port 5173 is busy, Vite will automatically use the next available port.

### Styling Not Working
Make sure Tailwind is properly configured:
1. Check `tailwind.config.js` exists
2. Check `postcss.config.js` exists
3. Verify `@tailwind` directives in `src/index.css`

### Icons Not Showing
Ensure `lucide-react` is installed:
```bash
npm install lucide-react
```

## Next Steps

To make this production-ready:
1. Connect to a backend API
2. Add authentication (JWT, OAuth)
3. Implement real file uploads
4. Add form validation library (React Hook Form)
5. Set up state management (Redux, Zustand)
6. Add real map integration (Google Maps, Mapbox)
7. Implement payment gateway
8. Add email notifications
9. Set up analytics
10. Deploy to hosting (Vercel, Netlify, AWS)

Enjoy building with Homigo! 🏠
