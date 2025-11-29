# ✅ VERIFY BUKIDNON SETUP

## Current Configuration

### Map Center Coordinates:
```javascript
lat: 8.1570  // Musuan, Bukidnon
lng: 125.1310
```

### Location:
- **City:** Musuan, Maramag
- **Province:** Bukidnon
- **Landmark:** CMU (Central Mindanao University)

## Verification Steps

### Step 1: Check Code
✅ **LandmarksMap.jsx** - Line 17
```javascript
const [mapCenter, setMapCenter] = useState({ lat: 8.1570, lng: 125.1310 })
```

### Step 2: Run SQL Update
**IMPORTANT:** You must run this SQL in Supabase:

```sql
-- Copy and paste the entire file:
backend/database/update_landmarks_bukidnon.sql
```

This will:
- Delete old Quezon City landmarks
- Add 16 new CMU Bukidnon landmarks
- All landmarks will be in Musuan/Maramag area

### Step 3: Restart Backend
```bash
cd backend
npm start
```

### Step 4: Refresh Browser
- Hard refresh: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
- Or clear cache and reload

### Step 5: Test
1. Login as premium user
2. Go to Landmarks Map
3. **Expected:** Map shows Bukidnon area (not Quezon City)
4. **Expected:** Landmarks list shows CMU area locations

## Troubleshooting

### If map still shows Quezon City:

**Problem 1: SQL not run**
- Solution: Run `update_landmarks_bukidnon.sql` in Supabase

**Problem 2: Old data cached**
- Solution: Hard refresh browser (Ctrl + Shift + R)

**Problem 3: Backend not restarted**
- Solution: Restart backend server

**Problem 4: Wrong API URL**
- Check: `http://localhost:5000/landmarks`
- Should return Bukidnon landmarks

## Quick Test

### Test API Directly:
```bash
curl http://localhost:5000/landmarks
```

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "name": "CMU Laundry Shop",
      "city": "Maramag, Bukidnon",
      "latitude": "8.1575",
      "longitude": "125.1315"
    },
    ...
  ]
}
```

### Test in Browser:
1. Open: `http://localhost:5173/student/landmarks`
2. Map should show Bukidnon (green/mountainous area)
3. NOT Manila Bay area (blue/coastal)

## Visual Confirmation

### Quezon City (WRONG):
- Coastal area
- Manila Bay visible
- Urban/metro area
- Coordinates: ~14.6, ~121.0

### Musuan, Bukidnon (CORRECT):
- Inland/mountainous
- Green areas
- Rural/agricultural
- Coordinates: ~8.1, ~125.1

## Database Check

Run this in Supabase to verify:

```sql
SELECT 
    name,
    city,
    latitude,
    longitude
FROM landmarks
LIMIT 5;
```

**Expected:** All cities should be "Maramag, Bukidnon"

## Final Checklist

- [ ] SQL file run in Supabase
- [ ] Backend restarted
- [ ] Browser hard refreshed
- [ ] Map shows Bukidnon (not Quezon City)
- [ ] Landmarks show CMU area
- [ ] Search "CMU" works
- [ ] Search "Maramag" works

---

**If all steps completed, map should show Musuan, Bukidnon!** 🗺️
