# 📊 Admin Analytics Dashboard - Quick Start Guide

## 🚀 Access the Dashboard

**URL**: https://homigov5.vercel.app/admin/analytics

**Requirements**:
- Admin account login
- Valid authentication token

---

## 📈 What You'll See

### 1. Key Metrics (Top Cards)
```
┌─────────────────────────────────────────────────────────┐
│  💰 Total Revenue    🏠 Total Bookings                  │
│  ₱45,678            89                                   │
│  123 transactions   45 confirmed                         │
├─────────────────────────────────────────────────────────┤
│  👥 New Users        🎯 Active Users                     │
│  33                 195                                  │
│  25 students        150 students                         │
└─────────────────────────────────────────────────────────┘
```

### 2. Booking Status Breakdown
- **Pending**: Yellow - Awaiting approval
- **Confirmed**: Green - Approved bookings
- **Completed**: Blue - Finished stays
- **Cancelled**: Red - Cancelled bookings

### 3. Subscription Tiers
- **Free**: Basic accounts
- **Basic**: Paid basic tier
- **Premium**: Premium subscribers

### 4. Top Performing Properties
Table showing:
- Property name
- Number of bookings
- Confirmed bookings
- Total revenue

### 5. Landlord Verification Status
- **Pending**: Awaiting verification
- **Verified**: Approved landlords
- **Total**: All landlords

---

## 🎯 How to Use

### Filter by Date Range

1. **Select Start Date**
   ```
   Click "Start Date" input → Choose date
   ```

2. **Select End Date**
   ```
   Click "End Date" input → Choose date
   ```

3. **Auto-Refresh**
   ```
   Dashboard automatically updates with new data
   ```

### Manual Refresh

```
Click "Refresh" button (top-right) → Data reloads
```

### Export Reports

1. **Revenue Report**
   ```
   Click "Revenue Report" → Downloads JSON file
   Contains: Total revenue, daily breakdown, transactions
   ```

2. **Booking Stats**
   ```
   Click "Booking Stats" → Downloads JSON file
   Contains: Status breakdown, totals, revenue
   ```

3. **Property Performance**
   ```
   Click "Property Performance" → Downloads JSON file
   Contains: Top properties, bookings, revenue
   ```

4. **Full Dashboard**
   ```
   Click "Full Dashboard" → Downloads JSON file
   Contains: All metrics combined
   ```

---

## 📊 Understanding the Metrics

### Revenue Metrics

**Total Revenue**
- Sum of all completed payments
- Only includes successful transactions
- Filtered by selected date range

**Transaction Count**
- Number of payment transactions
- Completed payments only

### Booking Metrics

**Total Bookings**
- All booking requests in date range
- Includes all statuses

**Confirmed**
- Bookings approved by landlord
- Active and ready

**Pending**
- Awaiting landlord approval
- Not yet confirmed

**Completed**
- Stays that have finished
- Past end date

**Cancelled**
- Cancelled by student or landlord
- No longer active

### User Metrics

**New Students**
- Student accounts created in date range
- First-time registrations

**New Landlords**
- Landlord accounts created in date range
- First-time registrations

**Active Students**
- Students with active accounts
- Can browse and book

**Active Landlords**
- Landlords with active accounts
- Can list properties

### Property Performance

**Bookings**
- Total booking requests for property
- All statuses included

**Confirmed**
- Approved bookings for property
- Active reservations

**Revenue**
- Total earnings from property
- Completed bookings only
- Sorted highest to lowest

### Subscription Breakdown

**Free Tier**
- Users on free plan
- Limited features

**Basic Tier**
- Paid basic subscribers
- Enhanced features

**Premium Tier**
- Premium subscribers
- Full features

### Verification Status

**Pending**
- Landlords awaiting verification
- Need admin review

**Verified**
- Approved landlords
- Can list properties

**Total**
- All landlord accounts
- Any status

---

## 🔍 Common Use Cases

### 1. Check Daily Revenue
```
1. Set date range to today
2. View "Total Revenue" card
3. Check transaction count
```

### 2. Monitor New Signups
```
1. Set date range to last 7 days
2. View "New Users" card
3. See student/landlord breakdown
```

### 3. Identify Top Properties
```
1. Scroll to "Top Performing Properties"
2. View ranked list
3. Check revenue per property
```

### 4. Track Booking Trends
```
1. Set date range to last 30 days
2. View "Booking Status" section
3. Compare confirmed vs cancelled
```

### 5. Monitor Verification Queue
```
1. Scroll to "Landlord Verification Status"
2. Check "Pending" count
3. Navigate to verifications page if needed
```

### 6. Generate Monthly Report
```
1. Set date range to last month
2. Click "Full Dashboard" export
3. Download JSON file
4. Analyze data offline
```

---

## 💡 Tips & Tricks

### Best Practices

1. **Regular Monitoring**
   - Check dashboard daily
   - Monitor pending verifications
   - Track revenue trends

2. **Date Range Selection**
   - Use 7 days for weekly reviews
   - Use 30 days for monthly reports
   - Use 90 days for quarterly analysis

3. **Export Reports**
   - Export monthly for records
   - Save for comparison
   - Share with stakeholders

4. **Performance Tracking**
   - Monitor top properties
   - Identify trends
   - Optimize platform

### Keyboard Shortcuts

```
Ctrl + R  → Refresh page
F5        → Reload dashboard
Ctrl + S  → (Browser save, not dashboard)
```

### Mobile Access

```
✅ Fully responsive
✅ Touch-friendly
✅ Scrollable tables
✅ All features available
```

---

## 🐛 Troubleshooting

### Issue: "Failed to fetch analytics data"

**Possible Causes**:
- Backend server down
- Network connection issue
- Invalid authentication token

**Solutions**:
1. Check internet connection
2. Verify backend is running
3. Re-login to refresh token
4. Contact support if persists

### Issue: "No data showing"

**Possible Causes**:
- Date range has no data
- Database is empty
- Query error

**Solutions**:
1. Adjust date range
2. Check if platform has activity
3. Verify database connection
4. Check browser console for errors

### Issue: "Export not working"

**Possible Causes**:
- Browser blocking downloads
- Popup blocker active
- Network timeout

**Solutions**:
1. Allow downloads in browser
2. Disable popup blocker
3. Try different browser
4. Check network connection

### Issue: "Unauthorized error"

**Possible Causes**:
- Not logged in as admin
- Token expired
- Insufficient permissions

**Solutions**:
1. Verify admin login
2. Re-login to get new token
3. Check admin role in database
4. Contact system administrator

---

## 📞 Support

### Need Help?

**Check Documentation**:
- ADMIN_ANALYTICS_FUNCTIONAL.md - Full technical details
- ADMIN_PANEL_GUIDE.md - General admin guide

**Test the API**:
```bash
node backend/test-analytics.js
```

**Check Backend Logs**:
```bash
# On Render.com dashboard
View logs → Check for errors
```

**Browser Console**:
```
F12 → Console tab → Check for errors
```

---

## ✅ Quick Checklist

Before reporting issues, verify:

- [ ] Logged in as admin
- [ ] Backend server is running
- [ ] Date range is valid
- [ ] Browser allows downloads
- [ ] Network connection is stable
- [ ] Token is not expired
- [ ] Database has data

---

## 🎯 Key Takeaways

1. **Real-Time Data**: All metrics from live database
2. **Date Filtering**: Customize date range for analysis
3. **Export Reports**: Download data for offline analysis
4. **Responsive Design**: Works on all devices
5. **Secure Access**: Admin authentication required

---

## 📊 Sample Dashboard View

```
╔════════════════════════════════════════════════════════╗
║           ADMIN ANALYTICS DASHBOARD                    ║
║                                                        ║
║  [Start Date: 2025-11-01] [End Date: 2025-11-29]     ║
║                                          [🔄 Refresh]  ║
╠════════════════════════════════════════════════════════╣
║                                                        ║
║  💰 Total Revenue        🏠 Total Bookings            ║
║  ₱45,678                89                             ║
║  123 transactions       45 confirmed                   ║
║                                                        ║
║  👥 New Users           🎯 Active Users                ║
║  33                     195                            ║
║  25 students            150 students                   ║
║                                                        ║
╠════════════════════════════════════════════════════════╣
║  BOOKING STATUS                                        ║
║  ⏳ Pending: 12  ✅ Confirmed: 45                     ║
║  ✔️ Completed: 30  ❌ Cancelled: 2                    ║
╠════════════════════════════════════════════════════════╣
║  SUBSCRIPTION TIERS                                    ║
║  🆓 Free: 100  💳 Basic: 30  💎 Premium: 20          ║
╠════════════════════════════════════════════════════════╣
║  TOP PERFORMING PROPERTIES                             ║
║  #1 Cozy Studio Apartment    15 bookings  ₱45,000    ║
║  #2 Modern Condo Unit        12 bookings  ₱38,000    ║
║  #3 Spacious Room            10 bookings  ₱30,000    ║
╠════════════════════════════════════════════════════════╣
║  LANDLORD VERIFICATION STATUS                          ║
║  ⏳ Pending: 5  ✅ Verified: 40  📊 Total: 45        ║
╠════════════════════════════════════════════════════════╣
║  EXPORT REPORTS                                        ║
║  [💰 Revenue] [🏠 Bookings] [🏢 Properties] [📊 Full]║
╚════════════════════════════════════════════════════════╝
```

---

**Last Updated**: November 29, 2025
**Version**: 2.0
**Status**: ✅ Production Ready

**Access Now**: https://homigov5.vercel.app/admin/analytics
