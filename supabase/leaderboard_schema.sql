-- =====================================================
-- LEADERBOARD FEATURE - DATABASE UPDATES
-- =====================================================
-- Run this after setup_complete.sql to add leaderboard functionality

-- 1. Add user details columns to quiz_results
ALTER TABLE quiz_results 
ADD COLUMN IF NOT EXISTS user_name text NOT NULL DEFAULT '',
ADD COLUMN IF NOT EXISTS email text NOT NULL DEFAULT '',
ADD COLUMN IF NOT EXISTS mobile_number text NOT NULL DEFAULT '',
ADD COLUMN IF NOT EXISTS college_name text NOT NULL DEFAULT '';

-- 2. Create leaderboard view
CREATE OR REPLACE VIEW leaderboard AS
SELECT 
  user_name,
  email,
  college_name,
  correct_answers,
  total_questions,
  time_taken_seconds,
  completed_at,
  RANK() OVER (ORDER BY correct_answers DESC, time_taken_seconds ASC) as rank
FROM quiz_results
WHERE user_name != '' AND email != ''
ORDER BY 
  correct_answers DESC,
  time_taken_seconds ASC;

-- 3. Grant access to leaderboard view
GRANT SELECT ON leaderboard TO anon, authenticated;

-- 4. Create function to get top N leaderboard entries
CREATE OR REPLACE FUNCTION get_top_leaderboard(limit_count integer DEFAULT 10)
RETURNS TABLE (
  rank bigint,
  user_name text,
  email text,
  college_name text,
  correct_answers integer,
  total_questions integer,
  time_taken_seconds integer,
  score_percentage numeric
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ROW_NUMBER() OVER (ORDER BY qr.correct_answers DESC, qr.time_taken_seconds ASC) as rank,
    qr.user_name,
    qr.email,
    qr.college_name,
    qr.correct_answers,
    qr.total_questions,
    qr.time_taken_seconds,
    ROUND((qr.correct_answers::numeric / qr.total_questions::numeric) * 100, 2) as score_percentage
  FROM quiz_results qr
  WHERE qr.user_name != '' AND qr.email != ''
  ORDER BY qr.correct_answers DESC, qr.time_taken_seconds ASC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Create function to submit quiz with user details
CREATE OR REPLACE FUNCTION submit_quiz_with_details(
  p_user_name text,
  p_email text,
  p_mobile_number text,
  p_college_name text,
  p_total_questions integer,
  p_correct_answers integer,
  p_time_taken_seconds integer,
  p_answers jsonb
) RETURNS uuid AS $$
DECLARE
  result_id uuid;
BEGIN
  INSERT INTO quiz_results (
    user_name,
    email,
    mobile_number,
    college_name,
    total_questions,
    correct_answers,
    time_taken_seconds,
    answers
  ) VALUES (
    p_user_name,
    p_email,
    p_mobile_number,
    p_college_name,
    p_total_questions,
    p_correct_answers,
    p_time_taken_seconds,
    p_answers
  ) RETURNING id INTO result_id;
  
  RETURN result_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Update RLS policies
DROP POLICY IF EXISTS "Anyone can insert quiz results" ON quiz_results;
DROP POLICY IF EXISTS "Anonymous users can view own results by id" ON quiz_results;

CREATE POLICY "Anyone can insert quiz results with details"
  ON quiz_results FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can view leaderboard results"
  ON quiz_results FOR SELECT
  TO anon, authenticated
  USING (true);

-- Verify the setup
SELECT 'Leaderboard schema updated successfully!' as status;
