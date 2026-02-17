-- =====================================================
-- DIAGNOSTIC QUERIES FOR USER REGISTRATION ERROR
-- =====================================================
-- Execute these queries in Supabase SQL Editor to diagnose the issue
-- =====================================================

-- 1. Check if profiles table exists and view its structure
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'profiles'
ORDER BY ordinal_position;

-- 2. Check RLS (Row Level Security) status on profiles table
SELECT 
    tablename, 
    rowsecurity
FROM pg_tables
WHERE schemaname = 'public' 
  AND tablename = 'profiles';

-- 3. List all RLS policies on profiles table
SELECT 
    policyname, 
    permissive, 
    roles, 
    cmd, 
    qual, 
    with_check
FROM pg_policies
WHERE schemaname = 'public' 
  AND tablename = 'profiles';

-- 4. Check if the trigger exists
SELECT 
    trigger_name, 
    event_manipulation, 
    event_object_table, 
    action_statement
FROM information_schema.triggers
WHERE trigger_schema = 'public' 
  OR event_object_schema = 'auth';

-- 5. Test if you can insert into profiles manually (replace with a real UUID)
-- IMPORTANT: Replace 'YOUR-UUID-HERE' with an actual UUID from auth.users
-- SELECT id FROM auth.users LIMIT 1; -- Run this first to get a UUID
/*
INSERT INTO public.profiles (
    id,
    full_name,
    email,
    role,
    subscription_status,
    trial_ends_at
) VALUES (
    'YOUR-UUID-HERE',
    'Test User',
    'test@example.com',
    'noiva',
    'trialing',
    NOW() + INTERVAL '7 days'
);
*/

-- 6. Check recent auth.users entries
SELECT 
    id, 
    email, 
    created_at,
    raw_user_meta_data
FROM auth.users
ORDER BY created_at DESC
LIMIT 5;

-- 7. Check if profiles were created for recent users
SELECT 
    p.id,
    p.full_name,
    p.email,
    p.role,
    p.created_at,
    u.email as auth_email
FROM public.profiles p
RIGHT JOIN auth.users u ON p.id = u.id
ORDER BY u.created_at DESC
LIMIT 5;

-- =====================================================
-- EXPECTED RESULTS:
-- =====================================================
-- Query 1: Should show all columns including id, full_name, email, role, subscription_status, trial_ends_at
-- Query 2: Should show rowsecurity = true or false
-- Query 3: Should show RLS policies (might be empty if RLS is disabled)
-- Query 4: Should show 'on_auth_user_created' trigger if it exists
-- Query 7: Should show if profiles are missing for some users (NULL in profile columns)
