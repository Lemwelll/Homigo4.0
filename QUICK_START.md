# Homigo - Quick Start Guide

## 🚀 Get Running in 3 Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Open Browser
Navigate to `http://localhost:5173`

---

## 🎯 Quick Navigation Guide

### Landing Page (`/`)
- Click **"I want to post my rental property"** → Landlord Registration
- Click **"I'm looking for a rent"** → Student Registration

### Landlord Portal
After registration, you'll see the sidebar with:

1. **Dashboard** (`/landlord/dashboard`)
   - View statistics
   - See recent properties
   - Click "Add Property" button

2. **My Properties** (`/landlord/properties`)
   - View all properties
   - Search properties
   - Click "Edit" to modify
   - Click "Delete" to remove
   - Click "View Details" to see full info

3. **Add Property** (`/landlord/add-property`)
   - Fill in property details
   - Select amenities
   - Submit form
   - Redirects to My Properties

4. **Messages** (`/landlord/messages`)
   - Search conversations
   - Click message to open chat
   - Send messages

5. **Settings** (`/landlord/settings`)
   - Update profile
   - Change password
   - Set notification preferences
   - Click "Save Changes"

---

## 🧪 Test the Features

### Test Adding a Property
1. Go to `/landlord/add-property`
2. Fill in:
   - Title: "Test Property"
   - Location: "Manila"
   - Price: 10000
   - Address: "123 Test St"
   - Bedrooms: 2
   - Bathrooms: 1
   - Description: "Test description"
3. Select some amenities
4. Click "Add Property"
5. See success message
6. Redirected to My Properties
7. New property appears in list

### Test Editing a Property
1. Go to `/landlord/properties`
2. Click "Edit" on any property
3. Modal opens with current data
4. Change the title
5. Click "Save Changes"
6. See success message
7. Modal closes
8. Changes reflected immediately

### Test Deleting a Property
1. Go to `/landlord/properties`
2. Click "Delete" on any property
3. Confirmation modal appears
4. Click "Delete" to confirm
5. Property removed from list
6. Dashboard stats update

### Test Search
1. Go to `/landlord/properties`
2. Type in search box
3. Properties filter in real-time
4. Clear search to see all

### Test Messages
1. Go to `/landlord/messages`
2. Click on a message in the list
3. Chat panel opens on right
4. Type a message
5. Click "Send"
6. Message appears in chat

### Test Settings
1. Go to `/landlord/settings`
2. Change your name
3. Toggle notification preferences
4. Click "Save Changes"
5. See success message

---

## 🎨 Key Features to Notice

### No Page Reloads
- Click any sidebar link
- Notice the URL changes
- Page content updates instantly
- No loading spinner or refresh

### Real-Time Updates
- Add a property
- Check Dashboard → Stats update
- Check My Properties → New property appears
- All without refreshing

### Interactive Modals
- Edit and Delete use modals
- Click outside to close
- Smooth animations
- Form validation

### Responsive Design
- Resize browser window
- Layout adapts automatically
- Mobile-friendly sidebar
- Touch-friendly buttons

---

## 📱 Mobile Testing

### Desktop View (> 1024px)
- Sidebar always visible
- 3-4 column grids
- Full navigation

### Tablet View (768px - 1024px)
- Sidebar visible
- 2 column grids
- Compact layout

### Mobile View (< 768px)
- Hamburger menu
- Stacked layouts
- Full-width cards
- Touch-optimized

---

## 🔍 What to Look For

### Visual Feedback
- ✅ Buttons change on hover
- ✅ Active page highlighted in sidebar
- ✅ Success messages appear
- ✅ Loading states (where applicable)
- ✅ Empty states with helpful text

### Smooth Interactions
- ✅ Animations on modals
- ✅ Transitions on navigation
- ✅ Hover effects on cards
- ✅ Form validation feedback

### Data Persistence
- ✅ Added properties stay in list
- ✅ Edited properties show changes
- ✅ Deleted properties disappear
- ✅ Stats recalculate automatically

---

## 🐛 Common Issues

### Port Already in Use
If port 5173 is busy, Vite will use the next available port. Check the terminal output.

### Styles Not Loading
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
```

### Changes Not Appearing
```bash
# Hard refresh browser
Ctrl + Shift + R (Windows/Linux)
Cmd + Shift + R (Mac)
```

---

## 📊 Sample Data

The app starts with 2 sample properties:
1. Modern Studio near UP Diliman - ₱8,500/mo
2. Cozy Room with WiFi - ₱5,000/mo

And 3 sample messages from students.

---

## 🎓 Learning Path

### Beginner
1. Navigate through all pages
2. Add a property
3. Edit a property
4. Delete a property

### Intermediate
1. Check the code in `src/pages/`
2. Look at `src/context/PropertyContext.jsx`
3. Understand the data flow
4. Modify a component

### Advanced
1. Add a new field to properties
2. Create a new page
3. Add a new feature
4. Connect to a backend API

---

## 📚 Documentation

- **README.md** - Full project overview
- **SETUP_GUIDE.md** - Detailed setup instructions
- **LANDLORD_PORTAL_GUIDE.md** - Feature documentation
- **DEVELOPER_GUIDE.md** - Code reference
- **PROJECT_SUMMARY.md** - Project overview

---

## 🎯 Quick Commands

```bash
# Development
npm run dev          # Start dev server

# Production
npm run build        # Build for production
npm run preview      # Preview production build

# Maintenance
npm install          # Install dependencies
npm update           # Update dependencies
```

---

## ✅ Checklist

Before you start coding:
- [ ] Dependencies installed
- [ ] Dev server running
- [ ] Browser open to localhost:5173
- [ ] Tested adding a property
- [ ] Tested editing a property
- [ ] Tested deleting a property
- [ ] Checked all pages load
- [ ] Verified responsive design

---

## 🎉 You're Ready!

The Homigo platform is fully functional and ready for:
- ✅ Development
- ✅ Testing
- ✅ Customization
- ✅ Backend integration
- ✅ Deployment

Start exploring and building! 🚀

---

**Need Help?**
- Check the documentation files
- Review the code comments
- Look at the component examples
- Test the features hands-on

**Happy Coding!** 💻
