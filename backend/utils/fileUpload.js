/**
 * File Upload Utilities
 * Handles file uploads to Supabase Storage
 */

import { supabase } from '../config/database.js';
import multer from 'multer';
import path from 'path';

// Configure multer for memory storage
const storage = multer.memoryStorage();

// File filter - only allow images
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and GIF are allowed.'), false);
  }
};

// Multer configuration
export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

/**
 * Upload file to Supabase Storage
 * @param {Buffer} fileBuffer - File buffer from multer
 * @param {string} fileName - Original filename
 * @param {string} folder - Storage folder (e.g., 'student-ids', 'government-ids')
 * @returns {Promise<string>} - Public URL of uploaded file
 */
export const uploadToSupabase = async (fileBuffer, fileName, folder) => {
  try {
    // Generate unique filename
    const timestamp = Date.now();
    const ext = path.extname(fileName);
    const uniqueFileName = `${folder}/${timestamp}-${Math.random().toString(36).substring(7)}${ext}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('verification-documents')
      .upload(uniqueFileName, fileBuffer, {
        contentType: 'image/jpeg',
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      throw new Error(`Upload failed: ${error.message}`);
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('verification-documents')
      .getPublicUrl(uniqueFileName);

    return urlData.publicUrl;
  } catch (error) {
    throw new Error(`File upload error: ${error.message}`);
  }
};

/**
 * Delete file from Supabase Storage
 * @param {string} fileUrl - Public URL of file to delete
 * @returns {Promise<boolean>} - Success status
 */
export const deleteFromSupabase = async (fileUrl) => {
  try {
    // Extract file path from URL
    const urlParts = fileUrl.split('/verification-documents/');
    if (urlParts.length < 2) {
      throw new Error('Invalid file URL');
    }
    
    const filePath = urlParts[1];

    // Delete from Supabase Storage
    const { error } = await supabase.storage
      .from('verification-documents')
      .remove([filePath]);

    if (error) {
      throw new Error(`Delete failed: ${error.message}`);
    }

    return true;
  } catch (error) {
    console.error('File delete error:', error.message);
    return false;
  }
};
