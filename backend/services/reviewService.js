import { supabase } from '../config/database.js';

class ReviewService {
  // Get all reviews for a property
  async getPropertyReviews(propertyId) {
    console.log('📥 Fetching reviews for property:', propertyId);
    
    try {
      // First, try simple query without joins
      const { data: reviews, error: reviewError } = await supabase
        .from('property_reviews')
        .select('*')
        .eq('property_id', propertyId)
        .order('created_at', { ascending: false });

      if (reviewError) {
        console.error('❌ Error fetching reviews:', reviewError);
        throw reviewError;
      }

      console.log(`✅ Found ${reviews?.length || 0} reviews`);

      // If no reviews, return empty array
      if (!reviews || reviews.length === 0) {
        return [];
      }

      // Fetch user data separately for each review
      const reviewsWithUsers = await Promise.all(
        reviews.map(async (review) => {
          const { data: user } = await supabase
            .from('users')
            .select('full_name, email')
            .eq('id', review.user_id)
            .single();

          return {
            ...review,
            reviewer_name: user?.full_name || 'Anonymous',
            reviewer_email: user?.email || ''
          };
        })
      );

      return reviewsWithUsers;
    } catch (error) {
      console.error('❌ Exception in getPropertyReviews:', error);
      throw error;
    }
  }

  // Get review statistics for a property
  async getPropertyReviewStats(propertyId) {
    const { data, error } = await supabase
      .from('property_reviews')
      .select('rating, cleanliness_rating, location_rating, value_rating')
      .eq('property_id', propertyId);

    if (error) throw error;

    if (!data || data.length === 0) {
      return {
        total_reviews: 0,
        average_rating: 0,
        avg_cleanliness: 0,
        avg_location: 0,
        avg_value: 0,
        five_star: 0,
        four_star: 0,
        three_star: 0,
        two_star: 0,
        one_star: 0
      };
    }

    // Calculate statistics
    const total = data.length;
    const avgRating = data.reduce((sum, r) => sum + r.rating, 0) / total;
    const avgCleanliness = data.filter(r => r.cleanliness_rating).reduce((sum, r) => sum + r.cleanliness_rating, 0) / data.filter(r => r.cleanliness_rating).length || 0;
    const avgLocation = data.filter(r => r.location_rating).reduce((sum, r) => sum + r.location_rating, 0) / data.filter(r => r.location_rating).length || 0;
    const avgValue = data.filter(r => r.value_rating).reduce((sum, r) => sum + r.value_rating, 0) / data.filter(r => r.value_rating).length || 0;

    return {
      total_reviews: total,
      average_rating: avgRating,
      avg_cleanliness: avgCleanliness,
      avg_location: avgLocation,
      avg_value: avgValue,
      five_star: data.filter(r => r.rating === 5).length,
      four_star: data.filter(r => r.rating === 4).length,
      three_star: data.filter(r => r.rating === 3).length,
      two_star: data.filter(r => r.rating === 2).length,
      one_star: data.filter(r => r.rating === 1).length
    };
  }

  // Create a new review
  async createReview(reviewData) {
    const {
      propertyId,
      userId,
      bookingId,
      rating,
      title,
      comment,
      cleanlinessRating,
      locationRating,
      valueRating
    } = reviewData;

    // Check if user has already reviewed this property
    const { data: existingReview, error: checkError } = await supabase
      .from('property_reviews')
      .select('id')
      .eq('property_id', propertyId)
      .eq('user_id', userId)
      .maybeSingle();

    console.log('🔍 Duplicate check:', { 
      propertyId, 
      userId, 
      existingReview, 
      hasExisting: !!existingReview 
    });

    if (existingReview) {
      throw new Error('You have already reviewed this property');
    }

    // Check if user has a completed booking for this property (if bookingId provided)
    if (bookingId) {
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .select('id')
        .eq('id', bookingId)
        .eq('user_id', userId)
        .eq('property_id', propertyId)
        .eq('status', 'completed')
        .maybeSingle();

      if (!booking) {
        throw new Error('You can only review properties you have booked');
      }
    }

    const { data, error } = await supabase
      .from('property_reviews')
      .insert({
        property_id: propertyId,
        user_id: userId,
        booking_id: bookingId,
        rating,
        title,
        comment,
        cleanliness_rating: cleanlinessRating,
        location_rating: locationRating,
        value_rating: valueRating,
        is_verified: bookingId ? true : false
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Update a review
  async updateReview(reviewId, userId, updateData) {
    const { rating, title, comment, cleanlinessRating, locationRating, valueRating } = updateData;

    // Check if review belongs to user
    const { data: review } = await supabase
      .from('property_reviews')
      .select('id')
      .eq('id', reviewId)
      .eq('user_id', userId)
      .single();

    if (!review) {
      throw new Error('Review not found or unauthorized');
    }

    const updateFields = {};
    if (rating !== undefined) updateFields.rating = rating;
    if (title !== undefined) updateFields.title = title;
    if (comment !== undefined) updateFields.comment = comment;
    if (cleanlinessRating !== undefined) updateFields.cleanliness_rating = cleanlinessRating;
    if (locationRating !== undefined) updateFields.location_rating = locationRating;
    if (valueRating !== undefined) updateFields.value_rating = valueRating;
    updateFields.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('property_reviews')
      .update(updateFields)
      .eq('id', reviewId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Delete a review
  async deleteReview(reviewId, userId) {
    const { data, error } = await supabase
      .from('property_reviews')
      .delete()
      .eq('id', reviewId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error || !data) {
      throw new Error('Review not found or unauthorized');
    }

    return data;
  }

  // Add landlord response to review
  async addLandlordResponse(reviewId, landlordId, response) {
    // Verify landlord owns the property
    const { data: review } = await supabase
      .from('property_reviews')
      .select(`
        id,
        properties:property_id (
          landlord_id
        )
      `)
      .eq('id', reviewId)
      .single();

    if (!review || review.properties?.landlord_id !== landlordId) {
      throw new Error('Review not found or unauthorized');
    }

    const { data, error } = await supabase
      .from('property_reviews')
      .update({
        landlord_response: response,
        landlord_response_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', reviewId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Mark review as helpful
  async markHelpful(reviewId) {
    // Get current count
    const { data: current } = await supabase
      .from('property_reviews')
      .select('helpful_count')
      .eq('id', reviewId)
      .single();

    if (!current) throw new Error('Review not found');

    const { data, error } = await supabase
      .from('property_reviews')
      .update({ helpful_count: (current.helpful_count || 0) + 1 })
      .eq('id', reviewId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Get user's reviews
  async getUserReviews(userId) {
    const { data, error } = await supabase
      .from('property_reviews')
      .select(`
        *,
        properties:property_id (
          title,
          address,
          city
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(review => ({
      ...review,
      property_title: review.properties?.title,
      property_address: review.properties?.address,
      property_city: review.properties?.city
    }));
  }
}

export default new ReviewService();
