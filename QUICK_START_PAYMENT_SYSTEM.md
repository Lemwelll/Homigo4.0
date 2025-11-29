# ⚡ QUICK START - PAYMENT SYSTEM

## 🚀 5-MINUTE SETUP

### Step 1: Database (2 minutes)
```sql
-- Open Supabase SQL Editor
-- Copy/paste and run these files in order:

⚠️ IMPORTANT: Check your users table ID type first!

If users.id is UUID (most Supabase databases):
1. backend/database/add_subscription_system_UUID.sql
2. backend/database/add_payment_history_UUID.sql

If users.id is INTEGER:
1. backend/database/add_subscription_system.sql
2. backend/database/add_payment_history.sql

💡 Not sure? Run this in SQL Editor:
SELECT data_type FROM information_schema.columns 
WHERE table_name = 'users' AND column_name = 'id';
```

### Step 2: Backend (1 minute)
```bash
cd backend
npm start
```

### Step 3: Test (2 minutes)
```bash
# Run test script
test-payment-system.bat

# Or manually test:
1. Login to app
2. Go to /upgrade
3. Complete payment
4. Go to /payment-history
5. See your transaction!
```

---

## 📍 KEY ROUTES

| Route | Purpose |
|-------|---------|
| `/upgrade` | Upgrade to premium |
| `/payment-history` | View all transactions |
| `/student/settings` | Manage subscription (student) |
| `/landlord/settings` | Manage subscription (landlord) |

---

## 🔌 KEY API ENDPOINTS

### Subscription:
```
GET  /subscriptions/status    - Current tier
POST /subscriptions/upgrade   - Upgrade to premium
POST /subscriptions/cancel    - Cancel subscription
```

### Payments:
```
GET  /payments/history        - Transaction list
GET  /payments/stats          - Payment statistics
GET  /payments/receipt/:id    - Download receipt
```

---

## 💾 DATABASE TABLES

| Table | Purpose |
|-------|---------|
| `users` | Subscription tier columns added |
| `subscription_history` | All subscription changes |
| `payment_transactions` | All payment records |
| `payment_refunds` | Refund requests |
| `payment_methods` | Saved payment methods |

---

## ✅ TESTING CHECKLIST

Quick test to verify everything works:

- [ ] Backend server running
- [ ] Database migrations complete
- [ ] Can login
- [ ] Can view subscription status
- [ ] Can upgrade to premium
- [ ] Payment appears in history
- [ ] Can view payment stats
- [ ] Can cancel subscription
- [ ] Tier persists after refresh

---

## 🐛 TROUBLESHOOTING

### "Cannot connect to database"
- Check backend/.env has correct DATABASE_URL
- Verify Supabase is running

### "Subscription not persisting"
- Run add_subscription_system.sql
- Restart backend server
- Clear browser cache

### "Payment history empty"
- Run add_payment_history.sql
- Complete a test payment
- Check user is authenticated

### "404 on /payments/history"
- Verify backend/routes/paymentRoutes.js exists
- Check backend/server.js has payment routes
- Restart backend server

---

## 📊 WHAT YOU GET

### For Users:
- ✅ Upgrade to premium
- ✅ View payment history
- ✅ Download receipts
- ✅ Request refunds
- ✅ Manage subscription

### For Developers:
- ✅ Complete backend API
- ✅ Database persistence
- ✅ Transaction tracking
- ✅ Payment statistics
- ✅ Refund system

---

## 🎯 NEXT STEPS

After payment system is working:

1. **Test thoroughly** - Try all features
2. **Implement profile updates** - Next critical feature
3. **Remove dummy data** - Clean up localStorage
4. **Final testing** - End-to-end tests
5. **Deploy** - Push to production

---

## 📚 FULL DOCUMENTATION

- **Complete Guide:** `PAYMENT_SYSTEM_COMPLETE.md`
- **Subscription Setup:** `SETUP_SUBSCRIPTION_BACKEND.md`
- **Payment History Setup:** `SETUP_PAYMENT_HISTORY.md`
- **Progress Tracking:** `BACKEND_INTEGRATION_PROGRESS.md`

---

## 💡 QUICK TIPS

1. **Always authenticate** - All endpoints require JWT token
2. **Check browser console** - Errors show there first
3. **Use test script** - `test-payment-system.bat` for quick verification
4. **Check database** - Verify data is actually saved
5. **Restart backend** - After any backend file changes

---

## 🎉 YOU'RE READY!

The payment system is complete and ready to use. Just follow the 5-minute setup above and you're good to go!

**Questions?** Check the full documentation files listed above.

**Issues?** Check the troubleshooting section.

**Ready to deploy?** See `PAYMENT_SYSTEM_COMPLETE.md` deployment checklist.
