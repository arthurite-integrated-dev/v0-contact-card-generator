# Troubleshooting Guide

## Common Issues and Solutions

### 1. "NEXT_PUBLIC_SUPABASE_URL is missing"

**Error**: `Error: NEXT_PUBLIC_SUPABASE_URL is required`

**Solution**:
1. Go to your Supabase project dashboard
2. Click Settings → API
3. Copy your Project URL
4. Add to environment variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   ```
5. Restart your dev server

---

### 2. "Cannot find contacts table"

**Error**: `relation "contacts" does not exist`

**Solution**:
1. Open your Supabase dashboard
2. Go to SQL Editor
3. Copy and paste the entire SQL from `/scripts/create_contacts_table.sql`
4. Click "Run"
5. Wait for completion
6. Refresh the app

---

### 3. "Permission denied" when adding contacts

**Error**: `new row violates row level security policy`

**Solution**:
The RLS policies aren't configured correctly. In Supabase:
1. Go to Authentication → Policies
2. Click on the `contacts` table
3. Ensure these policies exist:
   - `contacts_public_read` - SELECT
   - `contacts_authenticated_write` - INSERT
   - `contacts_authenticated_update` - UPDATE
   - `contacts_authenticated_delete` - DELETE

If missing, run the SQL setup again.

---

### 4. QR Code doesn't appear on card

**Error**: Empty space where QR code should be

**Solution**:
1. Check browser console (F12) for errors
2. Ensure `qrcode` package is installed: `npm ls qrcode`
3. Clear browser cache and hard refresh (Ctrl+Shift+R)
4. Check if the contact slug is being generated correctly
5. Verify window location is available (not SSR issue)

---

### 5. "slug" column doesn't exist

**Error**: `column "card_slug" does not exist`

**Solution**:
- Database schema wasn't created properly
- Re-run the SQL migration:
  ```sql
  ALTER TABLE contacts ADD COLUMN card_slug VARCHAR(255) UNIQUE NOT NULL;
  CREATE INDEX idx_contacts_slug ON contacts(card_slug);
  ```

---

### 6. Page shows "Contact not found" for valid cards

**Error**: Visiting `/card/john-doe-abc123` shows not found

**Solution**:
1. Verify the slug is correct in the URL
2. Check Supabase: Go to Table Editor → contacts
3. Search for the contact in the list
4. Verify `card_slug` column has the value
5. Check if Row Level Security is blocking access:
   - The `contacts_public_read` policy should have `USING (true)`

---

### 7. "Cannot read property 'photo_url' of null"

**Error**: JavaScript error when loading a card

**Solution**:
1. The contact was deleted or slug is invalid
2. Add null checks in your code (already done in ContactCard)
3. Verify contact exists in Supabase
4. Check card slug spelling matches exactly

---

### 8. Changes not appearing after adding contact

**Error**: Add a contact but it doesn't show in the list

**Solution**:
1. Clear browser cache (Ctrl+Shift+Delete)
2. Hard refresh the page (Ctrl+Shift+R)
3. Check browser console for errors
4. Verify Supabase has the new contact:
   - Go to Supabase dashboard → Table Editor → contacts
   - Should see the new row
5. Check if RLS policies are blocking reads

---

### 9. "CORS error" when loading photos

**Error**: `Access to image denied by CORS policy`

**Solution**:
1. Use image URLs from trusted sources (public URLs)
2. For Vercel Blob storage, ensure URL is public
3. Add the image domain to `next.config.js`:
   ```js
   images: {
     remotePatterns: [
       { protocol: 'https', hostname: '**.vercel-storage.com' },
     ],
   }
   ```

---

### 10. Supabase connection timeout

**Error**: `Error: connect ECONNREFUSED 127.0.0.1:5432`

**Solution**:
1. Check your internet connection
2. Verify Supabase project is running (not paused)
3. Check if using correct URL (not localhost)
4. Verify API keys are correct
5. Try in an incognito/private browser window
6. Check Supabase status: https://status.supabase.com

---

## Environment Setup Checklist

- [ ] Supabase account created
- [ ] Project initialized
- [ ] SQL migration executed
- [ ] `NEXT_PUBLIC_SUPABASE_URL` added
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` added
- [ ] Dev server restarted after adding env vars
- [ ] Can add contacts without errors
- [ ] Can view contact cards
- [ ] QR codes generate correctly

---

## Performance Tips

**Slow loading?**
1. Check Supabase query performance in dashboard
2. Add database indexes (already done for `card_slug`)
3. Use SWR for caching (client-side)
4. Enable Vercel analytics to monitor

**Too many database calls?**
1. Implement caching strategy
2. Use SWR library for client-side caching
3. Batch operations when possible

---

## Security Notes

✅ **What's Secure**:
- Public read access to cards (intentional for sharing)
- RLS policies prevent unauthorized modifications
- Environment variables keep secrets safe

⚠️ **Consider Adding**:
- Admin authentication (currently open)
- Rate limiting on API
- Input validation (partially done)
- File upload restrictions

---

## Getting Help

1. **Check Supabase docs**: https://supabase.com/docs
2. **Review error in browser console**: F12 → Console tab
3. **Check Supabase logs**: Project → Logs tab
4. **Check environment variables**: Are they set correctly?
5. **Verify database state**: Use Supabase dashboard

---

## Report a Bug

If you find an issue:
1. Note the exact error message
2. Check browser console for stack trace
3. Verify all environment variables are set
4. Test in incognito window to rule out cache
5. Create a minimal reproduction case
