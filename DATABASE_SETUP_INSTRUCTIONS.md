# 🔧 Database Setup Instructions

## Issue: "Loading quiz..." stuck on screen

### Cause
The quiz app is trying to load questions from the database, but the database either:
1. Doesn't have the questions yet
2. Has old questions that need updating
3. Has a connection issue

---

## ✅ Solution: Update Supabase Database

### Step 1: Open Supabase Dashboard
1. Go to https://supabase.com
2. Log in to your account
3. Select your project

### Step 2: Navigate to SQL Editor
1. Click on **SQL Editor** in the left sidebar
2. Click **New Query** button

### Step 3: Run the Setup Script
1. Open the file: `d:\Quizz\supabase\setup_complete.sql`
2. **Copy ALL contents** of the file (Ctrl+A, Ctrl+C)
3. **Paste** into Supabase SQL Editor
4. Click **Run** or press Ctrl+Enter

### Step 4: Verify Success
You should see:
```
Success. No rows returned
```

And at the bottom, you'll see query results showing:
- Question count by difficulty
- List of all 15 questions

### Step 5: Refresh Your Quiz App
1. Go back to your quiz at `http://localhost:5173/`
2. Press F5 to refresh
3. The quiz should now load properly! ✅

---

## 🔍 Verify Database Setup

After running the script, you can verify by running this query in Supabase SQL Editor:

```sql
SELECT 
  order_number,
  difficulty,
  LEFT(question_text, 60) as question_preview,
  correct_answer
FROM quiz_questions
ORDER BY order_number;
```

**Expected Result**: 15 rows
- Questions 1-9: difficulty = 'standard'
- Questions 10-15: difficulty = 'boss'

---

## 🐛 Still Having Issues?

### Check 1: Supabase Connection
Make sure your `.env` file has correct Supabase credentials:
```
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### Check 2: Browser Console
1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for error messages
4. Common errors:
   - "Failed to fetch" → Connection issue
   - "No questions found" → Database empty
   - "Invalid API key" → Wrong credentials

### Check 3: Network Tab
1. Open browser DevTools (F12)
2. Go to Network tab
3. Refresh page
4. Look for requests to Supabase
5. Check if they return 200 OK or errors

### Check 4: Row Level Security (RLS)
The script automatically sets up RLS policies, but verify:

```sql
-- Check if policies exist
SELECT 
  schemaname,
  tablename,
  policyname
FROM pg_policies
WHERE tablename = 'quiz_questions';
```

You should see: "Anyone can view quiz questions"

---

## 📋 What the Script Does

When you run `setup_complete.sql`, it:

1. ✅ Drops old tables (if they exist)
2. ✅ Creates `quiz_questions` table
3. ✅ Creates `quiz_results` table
4. ✅ Enables Row Level Security
5. ✅ Sets up security policies (public read access)
6. ✅ Inserts all 15 new quiz questions
7. ✅ Verifies setup with COUNT queries

---

## ⚡ Quick Fix Commands

If you need to quickly check or fix issues:

### Clear and Reset Everything:
```sql
-- Run this in Supabase SQL Editor
DROP TABLE IF EXISTS quiz_results CASCADE;
DROP TABLE IF EXISTS quiz_questions CASCADE;

-- Then run the full setup_complete.sql script
```

### Check if Questions Exist:
```sql
SELECT COUNT(*) FROM quiz_questions;
```
**Expected**: 15

### Check Connection from App:
Open browser console and type:
```javascript
// Test Supabase connection
const { data, error } = await supabase.from('quiz_questions').select('count');
console.log('Data:', data, 'Error:', error);
```

---

## 🎯 Success Checklist

- [ ] Opened Supabase Dashboard
- [ ] Navigated to SQL Editor
- [ ] Copied entire setup_complete.sql file
- [ ] Pasted and ran the script
- [ ] Saw "Success" message
- [ ] Verified 15 questions exist
- [ ] Refreshed quiz app (F5)
- [ ] Quiz loads and shows User Details form
- [ ] Can start and complete quiz

---

## 📞 Need More Help?

If the quiz still doesn't load after following these steps:

1. Check the browser console for errors
2. Verify your Supabase project URL and API key
3. Make sure the dev server is running (`npm run dev`)
4. Try clearing browser cache (Ctrl+Shift+Delete)
5. Check if Supabase project is active (not paused)

---

**Once you run the SQL script, your quiz will load immediately!** 🚀
