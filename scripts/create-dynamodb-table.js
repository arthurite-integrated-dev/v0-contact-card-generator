#!/usr/bin/env node

const { DynamoDBClient, CreateTableCommand, DescribeTableCommand } = require('@aws-sdk/client-dynamodb');

async function createContactsTable() {
  const client = new DynamoDBClient({
    region: process.env.REGION || 'us-east-1',
  });

  const tableName = process.env.DYNAMODB_TABLE_NAME || 'contacts';

  try {
    // Check if table already exists
    try {
      await client.send(new DescribeTableCommand({ TableName: tableName }));
      console.log(`✅ Table '${tableName}' already exists!`);
      return;
    } catch (error) {
      if (error.name !== 'ResourceNotFoundException') {
        throw error;
      }
    }

    // Create the table
    const createTableParams = {
      TableName: tableName,
      KeySchema: [
        {
          AttributeName: 'id',
          KeyType: 'HASH', // Partition key
        },
      ],
      AttributeDefinitions: [
        {
          AttributeName: 'id',
          AttributeType: 'S', // String
        },
        {
          AttributeName: 'card_slug',
          AttributeType: 'S', // String
        },
      ],
      GlobalSecondaryIndexes: [
        {
          IndexName: 'SlugIndex',
          KeySchema: [
            {
              AttributeName: 'card_slug',
              KeyType: 'HASH',
            },
          ],
          Projection: {
            ProjectionType: 'ALL',
          },
          ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5,
          },
        },
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5,
      },
    };

    console.log(`🚀 Creating DynamoDB table '${tableName}'...`);
    await client.send(new CreateTableCommand(createTableParams));
    
    console.log(`✅ Table '${tableName}' created successfully!`);
    console.log(`📝 Table details:`);
    console.log(`   - Name: ${tableName}`);
    console.log(`   - Partition Key: id (String)`);
    console.log(`   - Global Secondary Index: SlugIndex on card_slug`);
    console.log(`   - Read/Write Capacity: 5 units each`);
    
  } catch (error) {
    console.error('❌ Error creating table:', error.message);
    process.exit(1);
  }
}

// Check for required environment variables
if (!process.env.ACCESS_KEY_ID || !process.env.SECRET_ACCESS_KEY) {
  console.error('❌ Missing AWS credentials. Please set ACCESS_KEY_ID and SECRET_ACCESS_KEY environment variables.');
  process.exit(1);
}

createContactsTable();