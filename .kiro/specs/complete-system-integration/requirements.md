# Requirements Document

## Introduction

This specification covers the complete integration and verification of the Homigo student accommodation platform. The goal is to ensure 100% functionality across all user types (Student, Landlord, Admin) with complete frontend-backend-database connectivity, removal of all dummy data, and comprehensive testing of all features.

## Requirements

### Requirement 1: Database Schema Consolidation

**User Story:** As a developer, I want all database tables consolidated in a single schema.sql file, so that the database structure is clear and maintainable.

#### Acceptance Criteria

1. WHEN the schema.sql file is executed THEN all required tables SHALL be created with proper relationships
2. WHEN tables are created THEN foreign keys SHALL enforce referential integrity
3. WHEN the schema includes all tables THEN it SHALL support users, properties, images, amenities, verification logs, bookings, reservations, escrow, and notifications
4. IF a table already exists THEN the schema SHALL handle it gracefully without errors

### Requirement 2: Remove All Dummy Data

**User Story:** As a developer, I want all dummy/hardcoded data removed from the frontend, so that the application only displays real data from the database.

#### Acceptance Criteria

1. WHEN the StudentContext loads THEN it SHALL fetch properties from the backend API only
2. WHEN any component renders THEN it SHALL NOT use hardcoded dummy data
3. WHEN the application starts THEN all data SHALL come from Supabase database
4. IF no data exists in database THEN appropriate empty states SHALL be displayed

### Requirement 3: Student Features - Complete Integration

**User Story:** As a student, I want to browse, search, favorite, and book properties, so that I can find suitable accommodation.

#### Acceptance Criteria

1. WHEN student browses properties THEN only verified properties SHALL be displayed
2. WHEN student searches properties THEN results SHALL filter by location, price, and amenities
3. WHEN student favorites a property THEN it SHALL persist in the database
4. WHEN student views property details THEN landlord information SHALL be displayed
5. WHEN student makes a reservation THEN it SHALL create a database record with 48-hour expiry
6. WHEN student books a property THEN payment SHALL be processed through escrow
7. WHEN student views bookings THEN all their bookings SHALL be displayed from database

### Requirement 4: Landlord Features - Complete Integration

**User Story:** As a landlord, I want to manage my properties, view bookings, and handle reservations, so that I can rent out my properties effectively.

#### Acceptance Criteria

1. WHEN landlord creates a property THEN it SHALL be saved with pending_verification status
2. WHEN landlord uploads images THEN they SHALL be stored as base64 in database
3. WHEN landlord updates property THEN only their own properties SHALL be editable
4. WHEN landlord deletes property THEN it SHALL cascade delete related images and amenities
5. WHEN landlord views properties THEN only their properties SHALL be displayed
6. WHEN landlord receives reservation THEN they SHALL see it in reservations page
7. WHEN landlord receives booking THEN they SHALL see it in bookings page
8. WHEN landlord sets payment rules THEN they SHALL apply to new bookings

### Requirement 5: Admin Features - Complete Integration

**User Story:** As an admin, I want to verify properties, manage users, and monitor the platform, so that I can ensure quality and security.

#### Acceptance Criteria

1. WHEN admin views verifications THEN all pending properties SHALL be displayed
2. WHEN admin verifies a property THEN it SHALL change status to verified and log the action
3. WHEN admin rejects a property THEN it SHALL change status to rejected with admin note
4. WHEN admin views landlords THEN all landlord accounts SHALL be displayed
5. WHEN admin views dashboard THEN statistics SHALL be calculated from database
6. WHEN admin views all properties THEN they SHALL see properties of all statuses
7. IF only one admin account exists THEN no additional admins SHALL be created without authorization

### Requirement 6: Authentication & Authorization

**User Story:** As a user, I want secure authentication and role-based access, so that my data is protected.

#### Acceptance Criteria

1. WHEN user registers THEN password SHALL be hashed with bcrypt
2. WHEN user logs in THEN JWT token SHALL be generated and stored
3. WHEN user accesses protected route THEN token SHALL be validated
4. WHEN user role is checked THEN appropriate permissions SHALL be enforced
5. IF token is invalid THEN user SHALL be redirected to login
6. IF user accesses unauthorized route THEN they SHALL see 403 error

### Requirement 7: Property Management Workflow

**User Story:** As a platform user, I want properties to follow a clear workflow from creation to booking, so that the process is transparent.

#### Acceptance Criteria

1. WHEN landlord creates property THEN status SHALL be pending_verification
2. WHEN admin verifies property THEN status SHALL change to verified
3. WHEN property is verified THEN it SHALL appear in student browse
4. WHEN student reserves property THEN it SHALL be held for 48 hours
5. WHEN student books property THEN reservation SHALL convert to booking
6. WHEN booking is confirmed THEN escrow SHALL hold payment

### Requirement 8: Data Persistence & Synchronization

**User Story:** As a user, I want my actions to persist across sessions, so that I don't lose my data.

#### Acceptance Criteria

1. WHEN user performs any action THEN it SHALL be saved to database immediately
2. WHEN user refreshes page THEN data SHALL be fetched from database
3. WHEN multiple users access same data THEN they SHALL see consistent state
4. IF database operation fails THEN user SHALL see appropriate error message

### Requirement 9: Image Handling

**User Story:** As a landlord, I want to upload multiple property images, so that students can see my property clearly.

#### Acceptance Criteria

1. WHEN landlord uploads images THEN they SHALL be converted to base64
2. WHEN images are stored THEN they SHALL be linked to property with display_order
3. WHEN property is displayed THEN primary image SHALL be shown first
4. WHEN property is deleted THEN all images SHALL be cascade deleted
5. IF image upload fails THEN user SHALL see error message

### Requirement 10: Search & Filter Functionality

**User Story:** As a student, I want to search and filter properties, so that I can find properties matching my criteria.

#### Acceptance Criteria

1. WHEN student searches by location THEN properties SHALL filter by location field
2. WHEN student filters by price THEN properties SHALL filter by rent_price range
3. WHEN student filters by city THEN properties SHALL filter by extracted city
4. WHEN student filters by verified only THEN only verified properties SHALL show
5. WHEN filters are cleared THEN all properties SHALL be displayed

### Requirement 11: Notifications System

**User Story:** As a user, I want to receive notifications for important events, so that I stay informed.

#### Acceptance Criteria

1. WHEN property is verified THEN landlord SHALL receive notification
2. WHEN reservation is made THEN landlord SHALL receive notification
3. WHEN booking is confirmed THEN both parties SHALL receive notification
4. WHEN user views notifications THEN unread count SHALL update
5. WHEN user clicks notification THEN it SHALL mark as read

### Requirement 12: Escrow & Payment System

**User Story:** As a student, I want secure payment handling, so that my money is protected.

#### Acceptance Criteria

1. WHEN student makes payment THEN funds SHALL be held in escrow
2. WHEN booking is confirmed THEN funds SHALL be released to landlord
3. WHEN booking is cancelled THEN funds SHALL be refunded to student
4. WHEN downpayment is enabled THEN partial payment SHALL be accepted
5. WHEN payment fails THEN booking SHALL not be created
