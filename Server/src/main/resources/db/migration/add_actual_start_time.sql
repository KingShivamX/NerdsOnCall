-- Database migration to support direct video call sessions
-- This allows sessions without doubts and tracks actual call start time

-- First, make doubt_id nullable for direct call sessions
ALTER TABLE sessions
ALTER COLUMN doubt_id DROP NOT NULL;

-- Add actual_start_time column to sessions table
-- This allows us to track the real call start time separately from the session creation time
ALTER TABLE sessions
ADD COLUMN IF NOT EXISTS actual_start_time TIMESTAMP;

-- Add comments to explain the fields
COMMENT ON COLUMN sessions.start_time IS 'Session creation time (placeholder for DB constraint)';
COMMENT ON COLUMN sessions.actual_start_time IS 'Actual video call start time (used for duration calculation)';
COMMENT ON COLUMN sessions.doubt_id IS 'Doubt ID (nullable for direct video calls)';
