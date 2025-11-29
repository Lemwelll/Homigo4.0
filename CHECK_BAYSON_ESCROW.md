# Check Bayson Lemuel Escrow Status

## Run this SQL in Supabase SQL Editor:

```sql
-- 1. Find Bayson Lemuel's properties
SELECT 
    p.id,
    p.title,
    p.landlord_id,
    u.full_name as landlord_name
FROM properties p
LEFT JOIN users u ON p.landlord_id = u.id
WHERE p.title ILIKE '%bayson%'
ORDER BY p.created_at DESC;

-- 2. Check escrow_transactions for these properties
SELECT 
    et.id,
    et.property_id,
    et.status,
    et.released_date,
    p.title as property_title
FROM escrow_transactions et
LEFT JOIN properties p ON et.property_id = p.id
WHERE p.title ILIKE '%bayson%';

-- 3. Check escrow_payments for these properties
SELECT 
    ep.id,
    ep.property_id,
    ep.status,
    ep.released_date,
    p.title as property_title
FROM escrow_payments ep
LEFT JOIN properties p ON ep.property_id = p.id
WHERE p.title ILIKE '%bayson%';
```

## Expected Results:

If Bayson Lemuel's property has released escrow, you should see:
- Property ID in the first query
- Status = 'released' in either escrow_transactions OR escrow_payments

## If No Results:

The property doesn't have any escrow records, which means:
1. No one has booked it yet, OR
2. The escrow was created in a different table

## Next Steps:

1. **Run the SQL queries above**
2. **Check if there's a released escrow**
3. **Restart the backend** (to load the updated code)
4. **Refresh the browser** (Ctrl+F5)
5. **Check if the property shows as "NOT AVAILABLE"**

If it still doesn't work, share the SQL results and we'll debug further.
