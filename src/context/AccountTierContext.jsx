import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import API_URL from '../config/api';

const AccountTierContext = createContext();

export const useAccountTier = () => {
  const context = useContext(AccountTierContext);
  if (!context) {
    throw new Error('useAccountTier must be used within AccountTierProvider');
  }
  return context;
};

export const AccountTierProvider = ({ children }) => {
  const { user } = useAuth();
  const [accountState, setAccountState] = useState({
    tier: 'free',
    studentFavorites: 0,
    studentReservations: 0,
    landlordListings: 0,
    loading: true,
  });

  // Fetch subscription status from backend
  const fetchSubscriptionStatus = async () => {
    if (!user) {
      console.log('🔍 AccountTier: No user, setting to free');
      setAccountState(prev => ({ ...prev, tier: 'free', loading: false }));
      return;
    }

    try {
      const token = localStorage.getItem('homigo_token');
      console.log('🔍 AccountTier: Fetching subscription status for user:', user.id);
      
      const response = await fetch(`${API_URL}/subscriptions/status`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      console.log('🔍 AccountTier: Response:', data);
      
      if (data.success) {
        const tier = data.data.tier || 'free';
        console.log('✅ AccountTier: Setting tier to:', tier);
        setAccountState(prev => ({
          ...prev,
          tier: tier,
          loading: false
        }));
      } else {
        console.log('⚠️ AccountTier: API returned success=false, defaulting to free');
        setAccountState(prev => ({ ...prev, tier: 'free', loading: false }));
      }
    } catch (error) {
      console.error('❌ AccountTier: Failed to fetch subscription status:', error);
      setAccountState(prev => ({ ...prev, tier: 'free', loading: false }));
    }
  };

  // Fetch subscription status when user changes
  useEffect(() => {
    fetchSubscriptionStatus();
  }, [user]);

  // Upgrade to premium
  const upgradeToPremium = async (paymentData) => {
    try {
      const token = localStorage.getItem('homigo_token');
      const response = await fetch(`${API_URL}/subscriptions/upgrade`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(paymentData)
      });

      const data = await response.json();
      
      if (data.success) {
        setAccountState(prev => ({ ...prev, tier: 'premium' }));
        return { success: true, data: data.data };
      } else {
        return { success: false, error: data.message };
      }
    } catch (error) {
      console.error('Failed to upgrade subscription:', error);
      return { success: false, error: 'Failed to upgrade subscription' };
    }
  };

  // Downgrade to free
  const downgradeToFree = async () => {
    try {
      const token = localStorage.getItem('homigo_token');
      const response = await fetch(`${API_URL}/subscriptions/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setAccountState(prev => ({ ...prev, tier: 'free' }));
        return { success: true };
      } else {
        return { success: false, error: data.message };
      }
    } catch (error) {
      console.error('Failed to cancel subscription:', error);
      return { success: false, error: 'Failed to cancel subscription' };
    }
  };

  // Increment student favorites count
  const incrementStudentFavorites = () => {
    setAccountState(prev => ({
      ...prev,
      studentFavorites: prev.studentFavorites + 1,
    }));
  };

  // Decrement student favorites count
  const decrementStudentFavorites = () => {
    setAccountState(prev => ({
      ...prev,
      studentFavorites: Math.max(0, prev.studentFavorites - 1),
    }));
  };

  // Increment student reservations count
  const incrementStudentReservations = () => {
    setAccountState(prev => ({
      ...prev,
      studentReservations: prev.studentReservations + 1,
    }));
  };

  // Decrement student reservations count
  const decrementStudentReservations = () => {
    setAccountState(prev => ({
      ...prev,
      studentReservations: Math.max(0, prev.studentReservations - 1),
    }));
  };

  // Increment landlord listings count
  const incrementLandlordListings = () => {
    setAccountState(prev => ({
      ...prev,
      landlordListings: prev.landlordListings + 1,
    }));
  };

  // Decrement landlord listings count
  const decrementLandlordListings = () => {
    setAccountState(prev => ({
      ...prev,
      landlordListings: Math.max(0, prev.landlordListings - 1),
    }));
  };

  // Set specific counts (useful for syncing with backend)
  const setStudentFavorites = (count) => {
    setAccountState(prev => ({
      ...prev,
      studentFavorites: Math.max(0, count),
    }));
  };

  const setStudentReservations = (count) => {
    setAccountState(prev => ({
      ...prev,
      studentReservations: Math.max(0, count),
    }));
  };

  const setLandlordListings = (count) => {
    setAccountState(prev => ({
      ...prev,
      landlordListings: Math.max(0, count),
    }));
  };

  // Reset all counts
  const resetCounts = () => {
    setAccountState(prev => ({
      ...prev,
      studentFavorites: 0,
      studentReservations: 0,
      landlordListings: 0,
    }));
  };

  const value = {
    accountState,
    upgradeToPremium,
    downgradeToFree,
    fetchSubscriptionStatus,
    incrementStudentFavorites,
    decrementStudentFavorites,
    incrementStudentReservations,
    decrementStudentReservations,
    incrementLandlordListings,
    decrementLandlordListings,
    setStudentFavorites,
    setStudentReservations,
    setLandlordListings,
    resetCounts,
  };

  return (
    <AccountTierContext.Provider value={value}>
      {children}
    </AccountTierContext.Provider>
  );
};
