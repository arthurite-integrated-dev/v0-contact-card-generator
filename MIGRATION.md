# Migration Guide: Supabase to DynamoDB

This guide helps you migrate your existing contact data from Supabase to DynamoDB.

## Prerequisites

- Access to your existing Supabase project
- AWS account with DynamoDB access
- Node.js installed

## Step 1: Export Data from Supabase

### Option A: Using Supabase Dashboard
1. Go to your Supabase project dashboard
2. Navigate to Table Editor → contacts
3. Click "Export" and download as CSV

### Option B: Using SQL Query
Run this in your Supabase SQL Editor:

```sql
SELECT 
  id,
  name,
  position,
  email,
  phone,
  photo_url,
  card_slug,
  created_at,
  updated_at
FROM contacts
ORDER BY created_at;
```

Copy the results to a JSON file.

## Step 2: Set Up DynamoDB

Follow the instructions in [SETUP-DYNAMODB.md](./SETUP-DYNAMODB.md) to:
1. Create your DynamoDB table
2. Configure AWS credentials
3. Update environment variables

## Step 3: Import Data to DynamoDB

### Option A: Manual Import (Small datasets)
Use the admin panel in your application to manually re-add contacts.

### Option B: Bulk Import Script (Recommended)

Create a file `migrate-data.js`:

```javascript
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand } = require('@aws-sdk/lib-dynamodb');
const fs = require('fs');

// Your exported Supabase data
const supabaseData = [
  // Paste your exported data here
  {
    id: "uuid-here",
    name: "John Doe",
    position: "Manager",
    email: "john@example.com",
    phone: "+1234567890",
    photo_url: "https://example.com/photo.jpg",
    card_slug: "john-doe-abc123",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  }
  // ... more contacts
];

async function migrateData() {
  const client = new DynamoDBClient({
    region: process.env.AWS_REGION || 'us-east-1',
  });
  
  const docClient = DynamoDBDocumentClient.from(client);
  const tableName = process.env.DYNAMODB_TABLE_NAME || 'contacts';

  for (const contact of supabaseData) {
    try {
      await docClient.send(new PutCommand({
        TableName: tableName,
        Item: contact
      }));
      console.log(`✅ Migrated: ${contact.name}`);
    } catch (error) {
      console.error(`❌ Failed to migrate ${contact.name}:`, error.message);
    }
  }
  
  console.log('🎉 Migration completed!');
}

migrateData();
```

Run the migration:
```bash
node migrate-data.js
```

## Step 4: Update Environment Variables

Remove old Supabase variables:
```bash
# Remove these
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

Add DynamoDB variables:
```bash
# Add these
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
DYNAMODB_TABLE_NAME=contacts
```

## Step 5: Test the Migration

1. Start your application: `npm run dev`
2. Verify all contacts appear in the admin dashboard
3. Test creating new contacts
4. Test viewing individual contact cards
5. Verify QR codes still work

## Step 6: Update Deployment

If you're using Vercel:
1. Update environment variables in Vercel dashboard
2. Remove Supabase variables
3. Add AWS/DynamoDB variables
4. Redeploy your application

## Troubleshooting

### Common Issues

1. **Missing contacts**: Check that all data was exported and imported correctly
2. **Duplicate slugs**: DynamoDB doesn't enforce uniqueness like Supabase. You may need to regenerate slugs
3. **Permission errors**: Ensure your AWS credentials have proper DynamoDB permissions

### Data Validation

Run this script to validate your migration:

```javascript
const { DynamoDBDocumentClient, ScanCommand } = require('@aws-sdk/lib-dynamodb');

async function validateMigration() {
  // ... DynamoDB setup code ...
  
  const result = await docClient.send(new ScanCommand({
    TableName: 'contacts'
  }));
  
  console.log(`Total contacts in DynamoDB: ${result.Items.length}`);
  
  // Check for required fields
  const invalidContacts = result.Items.filter(contact => 
    !contact.name || !contact.email || !contact.card_slug
  );
  
  if (invalidContacts.length > 0) {
    console.log('⚠️  Invalid contacts found:', invalidContacts);
  } else {
    console.log('✅ All contacts are valid!');
  }
}
```

## Rollback Plan

If you need to rollback to Supabase:
1. Keep your Supabase project active during migration
2. Don't delete Supabase data until you're confident in the migration
3. You can revert the code changes using git

## Benefits of DynamoDB

After migration, you'll enjoy:
- Better scalability and performance
- Lower latency for global users
- Integration with other AWS services
- More predictable pricing for high-traffic applications