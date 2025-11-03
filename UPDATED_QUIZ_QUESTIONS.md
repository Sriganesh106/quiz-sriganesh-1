# 📝 Updated Quiz Questions

## Quiz Structure

### Standard Round (Questions 1-9) ✅
**Instruction**: Select the **CORRECT** answer

### Final Boss Round (Questions 10-15) ⚠️
**Instruction**: Select the **WRONG** answer

---

## Question Breakdown

### 📘 Standard Round Questions (Select CORRECT)

**Q1**: Which tag is the most semantically appropriate for the main content of a webpage?
- ✅ **Answer**: `<main>` (Option B)

**Q2**: Which input type provides a user interface element for selecting a value from a specified range?
- ✅ **Answer**: `type="range"` (Option C)

**Q3**: What is the purpose of the alt attribute on an `<img>` tag?
- ✅ **Answer**: Accessibility & fallback text (Option B)

**Q4**: To group related controls in a form, use:
- ✅ **Answer**: `<fieldset>` (Option B)

**Q5**: Which tag defines a self-contained content like a blog post?
- ✅ **Answer**: `<article>` (Option C)

**Q6**: What does box-sizing: border-box; do?
- ✅ **Answer**: Includes padding/border in width/height (Option B)

**Q7**: What does flex-direction: column; do?
- ✅ **Answer**: Stacks vertically (Option B)

**Q8**: To create a CSS Grid container, use:
- ✅ **Answer**: `display: grid;` (Option A)

**Q9**: Media query for screens wider than 1200px:
- ✅ **Answer**: `@media (min-width: 1200px)` (Option B)

---

### 🔥 Final Boss Round Questions (Select WRONG)

**Q10**: Select the **WRONG** statement about CSS selectors:
- ❌ **Wrong Answer**: `. = ID, # = Class` (Option B) ← User should select this

**Q11**: Select the **WRONG** way to center a block element horizontally:
- ❌ **Wrong Answer**: `align: center;` (Option B) ← User should select this

**Q12**: Select the **WRONG** statement about z-index:
- ❌ **Wrong Answer**: It changes the zoom level (Option C) ← User should select this

**Q13**: Select the **WRONG** way to declare a constant:
- ❌ **Wrong Answer**: `const` (Option B) ← User should select this (incomplete syntax)

**Q14**: Select the **WRONG** version of the loop that logs numbers 0 to 4:
- ❌ **Wrong Answer**: `for (let i = 0; i <= 5; i++) { console.log(i); }` (Option B) ← User should select this (logs 0-5, not 0-4)

**Q15**: Select the **WRONG** use of document.getElementById():
- ❌ **Wrong Answer**: `document.getElementById("#title")` (Option B) ← User should select this (# not needed)

---

## Database Changes Made

### File Updated: `supabase/setup_complete.sql`

**Changes**:
1. Questions 1-9 marked as `'standard'` difficulty
2. Questions 10-15 marked as `'boss'` difficulty
3. All question text, options, and correct answers updated
4. Boss transition now triggers after Question 9

### File Updated: `src/components/Results.tsx`

**Changes**:
- Updated text: "Standard Round: 9 questions • Final Boss Round: 6 questions"

---

## How to Apply Changes

### Step 1: Update Database
Run the updated SQL script in Supabase SQL Editor:

1. Open Supabase Dashboard
2. Go to SQL Editor
3. Copy entire contents from `d:\Quizz\supabase\setup_complete.sql`
4. Execute the script

**Important**: This will:
- Drop existing questions
- Create fresh questions table
- Insert all 15 new questions

### Step 2: Test the Quiz
1. Make sure dev server is running: `npm run dev`
2. Fill user details form
3. Start quiz
4. Answer questions 1-9 (select CORRECT answers)
5. Boss transition screen appears after Q9
6. Answer questions 10-15 (select WRONG answers)
7. View results

---

## Quiz Flow

```
User Details Form
       ↓
Welcome Screen
       ↓
Countdown (3-2-1)
       ↓
Questions 1-9 (Standard Round)
  • Select CORRECT answer
  • Green: HTML, CSS, JS basics
       ↓
Boss Transition Screen
  • "FINAL BOSS ROUND"
  • "Choose the INCORRECT Answer!"
       ↓
Questions 10-15 (Boss Round)
  • Select WRONG answer
  • Red/Orange theme
       ↓
Results Screen
  • Score breakdown
  • Leaderboard button
```

---

## Testing Checklist

- [ ] Database updated with new questions
- [ ] Questions 1-9 ask for correct answer
- [ ] Questions 10-15 ask for wrong answer
- [ ] Boss transition appears after Q9
- [ ] Boss round has red/orange theme
- [ ] Results show "9 questions • 6 questions"
- [ ] Leaderboard displays correctly
- [ ] All 15 questions load properly
- [ ] Scoring is accurate

---

## Scoring Logic

The app automatically:
- Compares user's selected option with `correct_answer` in database
- Marks as correct if they match
- Calculates final score out of 15
- Saves to leaderboard with user details

**For Boss Round**: The "correct" answer in the database IS the wrong option (the one users should select).

---

## Question Topics Coverage

### HTML (Questions 1-5)
- Semantic tags (`<main>`, `<article>`, `<fieldset>`)
- Input types (`type="range"`)
- Attributes (`alt`)

### CSS (Questions 6-12)
- Box model (`box-sizing`)
- Flexbox (`flex-direction`)
- Grid (`display: grid`)
- Media queries
- Selectors (. and #)
- Positioning (`z-index`)

### JavaScript (Questions 13-15)
- Variable declaration (`const`)
- Loops (`for`)
- DOM methods (`getElementById()`)

---

## Important Notes

⚠️ **Critical**: In the database, `correct_answer` for boss round questions (Q10-15) points to the WRONG option. This is intentional because users are asked to select the wrong answer.

✅ **Behavior**: 
- Standard Round: User selects correct → Gets point
- Boss Round: User selects wrong option → Gets point

🎯 **Perfect Score**: 15/15 (all questions answered correctly per round's instruction)

---

**Quiz questions successfully updated!** 🎉
