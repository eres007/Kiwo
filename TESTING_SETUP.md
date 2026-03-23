# Testing Setup

## Option 1: Disable RLS for Testing (Easiest)

Go to Supabase SQL Editor and run:

```sql
-- Disable RLS on memories table for testing
ALTER TABLE memories DISABLE ROW LEVEL SECURITY;
ALTER TABLE projects DISABLE ROW LEVEL SECURITY;
```

Then test with:
```bash
node test-api.js
```

## Option 2: Create a Test User

1. Go to Supabase Dashboard → Authentication → Users
2. Click "Add user"
3. Enter email: `test@example.com`
4. Enter password: `TestPassword123!`
5. Click "Create user"
6. Copy the user ID (UUID)
7. Update `test-api.js` with the real user ID

## Option 3: Use Service Role Key (Bypasses RLS)

The backend already uses `SUPABASE_SERVICE_ROLE_KEY` which bypasses RLS.

## Current Status

✅ Backend API is running
✅ Endpoints are responding
✅ Database connection is working
⏳ Just need to handle authentication for testing

## Next Steps

1. Choose one of the options above
2. Run `node test-api.js` again
3. You should see memories being created and retrieved
4. Then we build the admin dashboard
