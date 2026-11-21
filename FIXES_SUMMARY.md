# Comprehensive Fixes for Dhota Construction Website

## Issues to Fix:

### 1. ✅ Image Not Showing in Project Section
**Problem:** Uploaded images not displaying correctly
**Solution:** Update image URL construction to prepend BACKEND_URL

### 2. ✅ Warranty Period Change (10 → 30 years)
**Location:** `/api/faqs` endpoint in server.py
**Change:** Update FAQ answer from "10-year" to "30-year"

### 3. ✅ Add Customer Review Submission Section
**Implementation:**
- Add review submission form on HomePage
- Include fields: Name, Email, Phone, Rating, Comment, Image
- Allow image upload from device or camera
- Reviews go to admin for approval

### 4. ✅ Enhanced Review Model
**Backend Changes:**
- Update Review model to include email and phone
- Add public image upload endpoint
- Create ReviewCreateExtended model

### 5. ✅ Fix Forgot Password Flow
**Current:** Only asks for username and security question
**New:** Ask for Email, Admin Secret Key, and Security Question
**Reason:** More secure password reset process

### 6. ✅ Remove Sample Projects from Gallery
**Problem:** Sample/fallback projects shown when no admin projects exist
**Solution:** Remove sample projects fallback, show empty state instead

## Implementation Plan:

1. Backend updates (server.py)
2. Frontend HomePage - Add review section
3. Frontend AdminLogin - Fix forgot password
4. Frontend GalleryPage - Remove samples
5. Test all changes
