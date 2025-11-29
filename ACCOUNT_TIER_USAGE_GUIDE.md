# Account Tier Context - Usage Guide

## Overview
The AccountTierContext provides a global state management system for tracking user subscription tiers and usage limits across the application.

## Features
- ✅ Completely isolated - won't affect existing functionality
- ✅ Instant state updates without page reload
- ✅ Default tier is "free"
- ✅ Safe increment/decrement methods with minimum value protection
- ✅ Available globally through React Context

## State Structure
```javascript
{
  tier: "free", // or "premium"
  studentFavorites: 0,
  studentReservations: 0,
  landlordListings: 0
}
```

## How to Use

### 1. Import the hook
```javascript
import { useAccountTier } from '../context/AccountTierContext';
```

### 2. Use in any component
```javascript
function MyComponent() {
  const { 
    accountState, 
    upgradeToPremium,
    incrementStudentFavorites 
  } = useAccountTier();

  return (
    <div>
      <p>Current Tier: {accountState.tier}</p>
      <p>Favorites: {accountState.studentFavorites}</p>
      <button onClick={upgradeToPremium}>Upgrade to Premium</button>
      <button onClick={incrementStudentFavorites}>Add Favorite</button>
    </div>
  );
}
```

## Available Methods

### Tier Management
- `upgradeToPremium()` - Changes tier to "premium"
- `downgradeToFree()` - Changes tier to "free"

### Student Favorites
- `incrementStudentFavorites()` - Adds 1 to favorites count
- `decrementStudentFavorites()` - Subtracts 1 from favorites count (min: 0)
- `setStudentFavorites(count)` - Sets favorites to specific count

### Student Reservations
- `incrementStudentReservations()` - Adds 1 to reservations count
- `decrementStudentReservations()` - Subtracts 1 from reservations count (min: 0)
- `setStudentReservations(count)` - Sets reservations to specific count

### Landlord Listings
- `incrementLandlordListings()` - Adds 1 to listings count
- `decrementLandlordListings()` - Subtracts 1 from listings count (min: 0)
- `setLandlordListings(count)` - Sets listings to specific count

### Utility
- `resetCounts()` - Resets all counts to 0 (keeps tier unchanged)

## Example: Adding a Favorite
```javascript
import { useAccountTier } from '../context/AccountTierContext';

function FavoriteButton({ propertyId }) {
  const { accountState, incrementStudentFavorites } = useAccountTier();

  const handleAddFavorite = async () => {
    // Add to backend
    await addFavoriteAPI(propertyId);
    
    // Update local state instantly
    incrementStudentFavorites();
  };

  return (
    <button onClick={handleAddFavorite}>
      Add to Favorites ({accountState.studentFavorites})
    </button>
  );
}
```

## Example: Checking Tier Limits
```javascript
import { useAccountTier } from '../context/AccountTierContext';

function AddPropertyButton() {
  const { accountState, incrementLandlordListings } = useAccountTier();

  const FREE_LIMIT = 3;
  const canAddProperty = accountState.tier === 'premium' || 
                         accountState.landlordListings < FREE_LIMIT;

  const handleAddProperty = async () => {
    if (!canAddProperty) {
      alert('Upgrade to premium to add more properties!');
      return;
    }

    // Add property to backend
    await addPropertyAPI();
    
    // Update count
    incrementLandlordListings();
  };

  return (
    <button onClick={handleAddProperty} disabled={!canAddProperty}>
      Add Property ({accountState.landlordListings} / {accountState.tier === 'premium' ? '∞' : FREE_LIMIT})
    </button>
  );
}
```

## Example: Premium Upgrade Flow
```javascript
import { useAccountTier } from '../context/AccountTierContext';

function UpgradeButton() {
  const { accountState, upgradeToPremium } = useAccountTier();

  const handleUpgrade = async () => {
    // Process payment
    const success = await processPayment();
    
    if (success) {
      // Update tier instantly
      upgradeToPremium();
      alert('Welcome to Premium!');
    }
  };

  if (accountState.tier === 'premium') {
    return <span>✨ Premium Member</span>;
  }

  return <button onClick={handleUpgrade}>Upgrade to Premium</button>;
}
```

## Safety Features
- All decrement methods prevent negative values (minimum is 0)
- Context throws error if used outside provider (helps catch bugs early)
- State updates are immutable (uses spread operator)
- No side effects on existing contexts or components

## Integration Status
✅ Context created: `src/context/AccountTierContext.jsx`
✅ Provider added to App.jsx
✅ Available globally in all components
✅ Zero impact on existing functionality

## Next Steps (Optional)
You can now use this context in any component by importing `useAccountTier`. The context is ready to use but won't affect anything until you explicitly call its methods.
