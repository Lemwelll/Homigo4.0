/**
 * Upload Controller
 * Handles file upload requests (base64)
 */

import { supabase } from '../config/database.js';

/**
 * Upload student ID photo (base64)
 * POST /upload/student-id
 */
export const uploadStudentId = async (req, res) => {
  try {
    const { userId, base64Image } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    if (!base64Image) {
      return res.status(400).json({
        success: false,
        message: 'No image provided'
      });
    }

    // Update user record with base64 image
    const { error: updateError } = await supabase
      .from('users')
      .update({ student_id_photo_url: base64Image })
      .eq('id', userId);

    if (updateError) {
      console.error('Database update error:', updateError);
      throw new Error('Failed to update user record');
    }

    return res.status(200).json({
      success: true,
      message: 'Student ID uploaded successfully'
    });

  } catch (error) {
    console.error('Upload error:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message || 'File upload failed'
    });
  }
};

/**
 * Upload government ID photo (base64)
 * POST /upload/government-id
 */
export const uploadGovernmentId = async (req, res) => {
  try {
    const { userId, base64Image } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    if (!base64Image) {
      return res.status(400).json({
        success: false,
        message: 'No image provided'
      });
    }

    // Update user record with base64 image
    const { error: updateError } = await supabase
      .from('users')
      .update({ government_id_photo_url: base64Image })
      .eq('id', userId);

    if (updateError) {
      console.error('Database update error:', updateError);
      throw new Error('Failed to update user record');
    }

    return res.status(200).json({
      success: true,
      message: 'Government ID uploaded successfully'
    });

  } catch (error) {
    console.error('Upload error:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message || 'File upload failed'
    });
  }
};

/**
 * Upload verification document (base64)
 * POST /upload/verification-document
 */
export const uploadVerificationDocument = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { base64Image, documentType } = req.body;

    if (!documentType || !['validId', 'businessPermit', 'bankStatement'].includes(documentType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid document type'
      });
    }

    if (!base64Image) {
      return res.status(400).json({
        success: false,
        message: 'No image provided'
      });
    }

    // Check if document already exists
    const { data: existing } = await supabase
      .from('verification_documents')
      .select('id')
      .eq('user_id', userId)
      .eq('document_type', documentType)
      .single();

    if (existing) {
      // Update existing document
      const { data, error } = await supabase
        .from('verification_documents')
        .update({
          document_url: base64Image,
          uploaded_at: new Date().toISOString()
        })
        .eq('id', existing.id)
        .select()
        .single();

      if (error) throw error;

      return res.status(200).json({
        success: true,
        message: 'Verification document updated successfully',
        data
      });
    } else {
      // Insert new document
      const { data, error } = await supabase
        .from('verification_documents')
        .insert({
          user_id: userId,
          document_type: documentType,
          document_url: base64Image
        })
        .select()
        .single();

      if (error) throw error;

      return res.status(200).json({
        success: true,
        message: 'Verification document uploaded successfully',
        data
      });
    }

  } catch (error) {
    console.error('Upload verification document error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to upload verification document'
    });
  }
};
