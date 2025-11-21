# Fix Double View Tracking

## Problem
When visiting a property page, the view count increases by 2 instead of 1.

## Root Cause
React 18's **Strict Mode** in development causes `useEffect` to run twice to help detect side effects and bugs. This is intentional behavior in development but doesn't happen in production.

## Why It Happens
```javascript
// React 18 Strict Mode behavior in development:
useEffect(() => {
  trackView() // Runs once
  // Component unmounts (Strict Mode)
  // Component remounts (Strict Mode)
  trackView() // Runs again!
}, [])
```

This double-run helps developers catch bugs but causes our view tracking to fire twice.

## Solution
Use a `useRef` to track if we've already counted the view:

```javascript
// Before - Tracks twice
useEffect(() => {
  trackView()
}, [id])

// After - Tracks only once
const viewTracked = useRef(false)

useEffect(() => {
  if (!viewTracked.current) {
    viewTracked.current = true
    trackView()
  }
}, [id])
```

## How It Works

1. **First render:** `viewTracked.current` is `false`, so view is tracked
2. **Strict Mode unmount/remount:** `viewTracked.current` is still `true` (refs persist)
3. **Second render:** Check fails, view is NOT tracked again

## Implementation

### src/pages/PropertyDetails.jsx
```javascript
import { useState, useEffect, useRef } from 'react' // Added useRef

const PropertyDetails = () => {
  const viewTracked = useRef(false) // Track if view was counted

  useEffect(() => {
    const loadProperty = async () => {
      // ... load property

      // Track view only once
      if (!viewTracked.current) {
        viewTracked.current = true
        await fetch(`/activities/track-view/${id}`, { method: 'POST' })
      }
    }
    loadProperty()
  }, [id])
}
```

## Why useRef Instead of useState?

| Approach | Result |
|----------|--------|
| `useState` | Would cause re-render, still tracks twice |
| `useRef` | Persists across renders, no re-render, tracks once ✅ |

## Testing

### Before Fix
```
Visit property page → Views: +2
Refresh page → Views: +2
Total after 2 visits: +4 ❌
```

### After Fix
```
Visit property page → Views: +1
Refresh page → Views: +1
Total after 2 visits: +2 ✅
```

## Production vs Development

| Environment | Strict Mode | View Tracking |
|-------------|-------------|---------------|
| Development | Enabled | Once (with fix) |
| Production | Disabled | Once (naturally) |

## Alternative Solutions

### Option 1: Disable Strict Mode (Not Recommended)
```javascript
// index.jsx - Remove StrictMode
<React.StrictMode> // ❌ Don't do this
  <App />
</React.StrictMode>

// Better to keep Strict Mode for bug detection
```

### Option 2: Backend Deduplication (Complex)
Track view with timestamp and user session, ignore duplicates within X seconds.

### Option 3: useRef Flag (Recommended) ✅
Simple, effective, works in both dev and production.

## Files Modified
- `src/pages/PropertyDetails.jsx` - Added useRef to prevent double tracking

## Result
✅ Views now increment by 1 per visit
✅ Accurate analytics
✅ Strict Mode still enabled for bug detection
✅ Works correctly in both development and production
