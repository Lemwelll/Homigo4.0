/**
 * Custom Hook for Optimized Data Fetching
 * Features: Loading states, Error handling, Auto-retry, Caching
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import ApiClient from '../utils/apiClient';

export const useOptimizedFetch = (endpoint, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);
  
  const {
    skip = false,
    dependencies = [],
    onSuccess,
    onError,
    transform,
  } = options;
  
  const fetchData = useCallback(async () => {
    if (skip) return;
    
    // Abort previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();
    
    try {
      setLoading(true);
      setError(null);
      
      const result = await ApiClient.get(endpoint, {
        signal: abortControllerRef.current.signal,
      });
      
      const transformedData = transform ? transform(result) : result;
      setData(transformedData);
      
      if (onSuccess) {
        onSuccess(transformedData);
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message);
        if (onError) {
          onError(err);
        }
      }
    } finally {
      setLoading(false);
    }
  }, [endpoint, skip, transform, onSuccess, onError]);
  
  useEffect(() => {
    fetchData();
    
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchData, ...dependencies]);
  
  const refetch = useCallback(() => {
    ApiClient.clearCache(endpoint);
    fetchData();
  }, [endpoint, fetchData]);
  
  return {
    data,
    loading,
    error,
    refetch,
  };
};

export default useOptimizedFetch;
