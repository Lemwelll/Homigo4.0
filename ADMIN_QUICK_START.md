# Admin Panel - Quick Start Guide

## 🚀 Access the Admin Panel

Navigate to: `http://localhost:5173/admin/dashboard`

---

## 📊 Dashboard Overview

### What You'll See
- **4 Statistics Cards**: Landlords, Pending Verifications, Active Properties, Reports
- **Pending Verifications**: Preview of properties awaiting approval
- **Recent Activities**: Latest platform actions
- **Quick Stats**: Verification rate, verified landlords, pending reviews

### Quick Actions
- Click "View All" → Go to specific management page
- Stats update automatically when you perform actions

---

## ✅ Verify Properties

### Navigate
Go to **Verifications** in sidebar or click "View All" from dashboard

### Actions
1. **Search**: Type property name or landlord name
2. **Filter**: Select status (All, Pending, Verified, Rejected)
3. **Approve**: Click ✅ button on pending property
4. **Reject**: Click ❌ button on pending property
5. **View**: Click 👁️ to see property details

### What Happens
- Status changes immediately
- Success message appears
- Dashboard stats update
- Activity logged

---

## 👥 Manage Landlords

### Navigate
Go to **Landlords** in sidebar

### Actions
1. **Search**: Type landlord name or email
2. **Verify**: Click "Verify" button on pending landlord
3. **Suspend**: Click "Suspend" button on verified landlord
4. **View Documents**: Click 👁️ to review verification docs

### Information Displayed
- Name and avatar
- Email and phone
- Total properties
- Join date
- Current status

---

## 🚩 Handle Reports

### Navigate
Go to **Reports** in sidebar

### Actions
1. **Search**: Type property title or reporter name
2. **Filter**: Select status (Pending, Resolved, Dismissed)
3. **Resolve**: Click "Resolve" to mark as handled
4. **Dismiss**: Click "Dismiss" to close without action
5. **View Property**: Click to see reported property

### Report Information
- Property title
- Who reported it
- Reason for report
- Full description
- Report date

---

## ⚙️ Admin Settings

### Navigate
Go to **Settings** in sidebar

### What You Can Change
- **Profile**: Name and email
- **Password**: Update admin password
- **Notifications**: 
  - Email for new reports
  - Instant alerts
  - Weekly summaries
- **Platform Settings**:
  - Auto-approve verified landlords

### Save Changes
Click "Save Changes" button at bottom

---

## 🧪 Quick Test Flow

### Test Property Verification
```
1. Go to /admin/verifications
2. Find a "Pending" property
3. Click ✅ Approve button
4. See success message
5. Check Dashboard → Stats updated
6. Check property status → Now "Verified"
```

### Test Landlord Verification
```
1. Go to /admin/landlords
2. Find a "Pending" landlord
3. Click "Verify" button
4. See success message
5. Check Dashboard → Stats updated
6. Button changes to "Suspend"
```

### Test Report Resolution
```
1. Go to /admin/reports
2. Find a "Pending Review" report
3. Read the description
4. Click "Resolve" button
5. See success message
6. Report status → "Resolved"
```

---

## 📈 Understanding Statistics

### Dashboard Stats
- **Total Landlords**: All registered landlords
- **Pending Verifications**: Properties awaiting approval
- **Active Properties**: Verified and live listings
- **Reported Listings**: Properties with pending reports

### Verification Rate
```
(Active Properties / Total Properties) × 100
```

### Status Colors
- 🟢 **Green**: Verified, Resolved, Success
- 🟡 **Yellow**: Pending, Awaiting Review
- 🔴 **Red**: Rejected, Suspended, Dismissed

---

## 🔍 Search Tips

### Property Search
- Search by property title
- Search by landlord name
- Combine with status filter

### Landlord Search
- Search by name
- Search by email
- Results update instantly

### Report Search
- Search by property title
- Search by reporter name
- Filter by resolution status

---

## ⚡ Quick Actions Reference

### From Dashboard
- **View All Verifications** → `/admin/verifications`
- **View All Landlords** → `/admin/landlords`
- Click any pending item → Go to management page

### Keyboard Shortcuts (Future)
- `Ctrl + K` → Quick search
- `Ctrl + 1-5` → Navigate sections
- `Esc` → Close modals

---

## 🎯 Common Tasks

### Morning Routine
1. Check Dashboard for pending items
2. Review new reports
3. Verify pending properties
4. Approve new landlords

### Weekly Tasks
1. Review all pending verifications
2. Check suspended accounts
3. Review resolved reports
4. Update settings if needed

### Monthly Tasks
1. Review verification rate
2. Check landlord activity
3. Analyze report trends
4. Update platform settings

---

## 💡 Pro Tips

### Efficiency
- Use search before scrolling
- Filter by status to focus
- Approve in batches
- Check activity feed regularly

### Best Practices
- Always review before approving
- Read full report descriptions
- Check landlord history
- Document suspension reasons

### Avoid
- Approving without verification
- Dismissing reports without review
- Suspending without cause
- Ignoring pending items

---

## 🐛 Troubleshooting

### Stats Not Updating
- Refresh the page
- Check if action completed
- Verify you're on latest version

### Can't Find Item
- Check search spelling
- Clear filters
- Try different search terms

### Action Not Working
- Check internet connection
- Refresh the page
- Try again

---

## 📱 Mobile Access

### Responsive Features
- Sidebar collapses to menu
- Tables scroll horizontally
- Cards stack vertically
- Touch-friendly buttons

### Mobile Tips
- Use landscape for tables
- Swipe to see more columns
- Tap to expand details

---

## 🎓 Learning Path

### Beginner (Day 1)
1. Explore Dashboard
2. Navigate all sections
3. Understand statistics
4. Try search and filters

### Intermediate (Week 1)
1. Approve properties
2. Verify landlords
3. Resolve reports
4. Update settings

### Advanced (Month 1)
1. Identify patterns
2. Optimize workflow
3. Handle edge cases
4. Provide feedback

---

## 📚 Additional Resources

- **ADMIN_PANEL_GUIDE.md** - Complete feature documentation
- **DEVELOPER_GUIDE.md** - Technical implementation
- **README.md** - Project overview

---

## ✅ Quick Checklist

Before you start:
- [ ] Admin panel loads at `/admin/dashboard`
- [ ] All stats display correctly
- [ ] Can navigate all sections
- [ ] Search works in all pages
- [ ] Can approve a property
- [ ] Can verify a landlord
- [ ] Can resolve a report
- [ ] Settings save successfully

---

## 🎉 You're Ready!

The Admin Panel is fully functional and ready to use. Start by:
1. Checking the Dashboard
2. Reviewing pending verifications
3. Approving your first property
4. Verifying a landlord

**Happy Administrating!** 🚀
