# Leaderboard Feature - Setup Guide

## Overview
This guide will help you set up the leaderboard feature with user details collection and animated UI components.

## Features Implemented

### ✅ User Details Form
- Clean, responsive input form with validation
- Fields: Name, Email, Mobile Number, College Name
- Real-time validation with error messages
- Modern gradient design with smooth animations

### ✅ Leaderboard Display
- Top 10 performers
- Displays: Name, Email, College, Score
- **Glowing border animation** that moves from left to right
- **Hanging badge animations** for top 3 positions (1st, 2nd, 3rd)
- Highlights current user's entry
- Responsive design with smooth fade-in animations

### ✅ Database Schema
- Updated `quiz_results` table with user details
- New RPC function for submitting results
- Leaderboard view for efficient queries
- Row Level Security policies

## Setup Instructions

### Step 1: Update Database Schema

Run the SQL script to add leaderboard functionality to your Supabase database:

```bash
# Navigate to the supabase folder
cd supabase

# Run the leaderboard schema SQL
# Copy the contents of leaderboard_schema.sql and execute it in Supabase SQL Editor
```

**OR** Execute this in your Supabase SQL Editor:

```sql
-- Copy all contents from: d:\Quizz\supabase\leaderboard_schema.sql
```

### Step 2: Verify Database Setup

After running the SQL script, verify:

1. **Table Columns**: Check that `quiz_results` table has new columns:
   - `user_name`
   - `email`
   - `mobile_number`
   - `college_name`

2. **Functions**: Verify these functions exist:
   - `submit_quiz_with_details()`
   - `get_top_leaderboard()`

3. **View**: Check that `leaderboard` view exists

### Step 3: Run the Application

```bash
# Install dependencies (if not already done)
npm install

# Start the development server
npm run dev
```

## User Flow

1. **User Details Form** → User enters personal information
2. **Welcome Screen** → Quiz instructions and start button
3. **Quiz Questions** → 15 timed questions
4. **Results Screen** → Shows score and statistics
5. **Leaderboard** → Displays top 10 performers with animations

## UI/UX Highlights

### User Details Form
- **Modern gradient background** (slate-900 to slate-800)
- **Icon-enhanced inputs** (User, Mail, Phone, GraduationCap)
- **Real-time validation** with red error messages
- **Smooth animations** on page load

### Leaderboard
- **Glowing border animation**: Continuous left-to-right gradient glow
- **Hanging badges**: Top 3 users get animated medal badges
  - 🥇 1st Place: Gold crown with swing animation
  - 🥈 2nd Place: Silver medal with swing animation
  - 🥉 3rd Place: Bronze award with swing animation
- **Fade-in animations**: Each entry fades in sequentially
- **User highlight**: Current user's row is highlighted in green
- **Responsive grid**: Adapts to all screen sizes

## Animation Details

### Glowing Border
```css
- Movement: Left to right
- Duration: 3 seconds
- Colors: Emerald-500 → Blue-500 gradient
- Effect: Continuous loop
```

### Hanging Badges
```css
- Animation: Subtle swing/sway effect
- Duration: 3-4 seconds per badge
- Rotation: ±3 degrees
- Effect: Simulates hanging medal on string
```

### Entry Animations
```css
- Type: Fade in + Slide up
- Duration: 0.5 seconds
- Stagger: 0.1s per entry
- Effect: Sequential reveal
```

## Customization

### Change Leaderboard Limit
Edit the function call in `Leaderboard.tsx`:

```typescript
const { data, error } = await supabase.rpc('get_top_leaderboard', {
  limit_count: 20,  // Change from 10 to any number
});
```

### Modify Animation Speeds
Edit the `<style>` section in `Leaderboard.tsx`:

```css
/* Speed up/slow down glowing border */
animation: glowMove 2s linear infinite;  /* Change from 3s */

/* Adjust badge swing */
animation: swingBadge 5s ease-in-out infinite;  /* Change from 3-4s */
```

### Change Colors
Update gradient colors in components:
- **Form**: `from-slate-900 via-slate-800 to-slate-900`
- **Buttons**: `from-emerald-500 to-blue-500`
- **Leaderboard header**: `from-emerald-500 to-blue-500`

## Database Functions Reference

### `submit_quiz_with_details()`
Saves quiz results with user information:

```typescript
await supabase.rpc('submit_quiz_with_details', {
  p_user_name: 'John Doe',
  p_email: 'john@example.com',
  p_mobile_number: '+1234567890',
  p_college_name: 'Example University',
  p_total_questions: 15,
  p_correct_answers: 12,
  p_time_taken_seconds: 450,
  p_answers: [...],
});
```

### `get_top_leaderboard()`
Fetches top N performers:

```typescript
const { data } = await supabase.rpc('get_top_leaderboard', {
  limit_count: 10,
});
```

## Components Created

1. **`UserDetailsForm.tsx`**
   - Input form with validation
   - Located: `src/components/`

2. **`Leaderboard.tsx`**
   - Animated leaderboard display
   - Located: `src/components/`

3. **Updated `Results.tsx`**
   - Includes leaderboard after results

4. **Updated `App.tsx`**
   - Integrated user details flow
   - State management for user info

## Troubleshooting

### Leaderboard Not Showing
- Check Supabase connection in browser console
- Verify SQL functions were created successfully
- Ensure RLS policies allow SELECT on `quiz_results`

### User Details Not Saving
- Check `submit_quiz_with_details` function exists
- Verify all required parameters are passed
- Check browser console for errors

### Animations Not Working
- Clear browser cache
- Check if TailwindCSS is properly configured
- Verify custom animations in `<style>` tags

## Next Steps

Consider adding:
- **Time-based leaderboards** (daily/weekly/monthly)
- **Filtering by college**
- **Achievement badges**
- **Share to social media**
- **Export results as PDF**
- **Email notifications for top positions**

## Support

For issues or questions:
1. Check browser console for errors
2. Verify Supabase configuration
3. Review SQL execution logs in Supabase dashboard

---

**Enjoy your interactive quiz leaderboard! 🏆**
