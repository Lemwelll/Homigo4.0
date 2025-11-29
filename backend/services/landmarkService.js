import { supabase } from '../config/database.js';

class LandmarkService {
  // Get all landmarks with optional filters
  async getAllLandmarks(filters = {}) {
    let query = supabase
      .from('landmarks')
      .select('*')
      .eq('is_active', true);

    if (filters.type && filters.type !== 'all') {
      query = query.eq('type', filters.type);
    }

    if (filters.city) {
      query = query.ilike('city', `%${filters.city}%`);
    }

    const { data, error } = await query.order('name');

    if (error) throw error;
    return data || [];
  }

  // Get nearby landmarks based on coordinates
  async getNearbyLandmarks(latitude, longitude, radiusKm = 5) {
    const { data, error } = await supabase
      .from('landmarks')
      .select('*')
      .eq('is_active', true);

    if (error) throw error;

    // Filter by distance
    const nearby = data.filter(landmark => {
      const distance = this.calculateDistance(
        latitude, longitude,
        parseFloat(landmark.latitude), parseFloat(landmark.longitude)
      );
      return distance <= radiusKm;
    });

    // Add distance to each landmark
    return nearby.map(landmark => ({
      ...landmark,
      distance: this.calculateDistance(
        latitude, longitude,
        parseFloat(landmark.latitude), parseFloat(landmark.longitude)
      ).toFixed(2)
    })).sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
  }

  // Calculate distance between two coordinates (Haversine formula)
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  toRad(degrees) {
    return degrees * (Math.PI / 180);
  }
}

export default new LandmarkService();
