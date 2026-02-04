import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, GetCommand, ScanCommand, DeleteCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({
  region: process.env.REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID!,
    secretAccessKey: process.env.SECRET_ACCESS_KEY!,
  },
});

const docClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME || 'contacts';

// Test connection function
export async function testDynamoDBConnection(): Promise<boolean> {
  try {
    console.log('Testing DynamoDB connection...');
    const command = new ScanCommand({
      TableName: TABLE_NAME,
      Limit: 1
    });
    
    const response = await docClient.send(command);
    console.log('✅ DynamoDB connection successful:', response);
    return true;
  } catch (error) {
    console.error('❌ DynamoDB connection failed:', error);
    return false;
  }
}

export interface Contact {
  id: string;
  name: string;
  position: string;
  email: string;
  phone: string | null;
  photo_url: string | null;
  card_slug: string;
  created_at: string;
  updated_at: string;
}

export async function getContacts(): Promise<Contact[]> {
  try {
    const command = new ScanCommand({
      TableName: TABLE_NAME,
    });
    
    const response = await docClient.send(command);
    const contacts = (response.Items || []) as Contact[];
    
    // Sort by created_at descending
    return contacts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  } catch (error) {
    console.error('Error getting contacts:', error);
    throw error;
  }
}

export async function getContactBySlug(slug: string): Promise<Contact | null> {
  try {
    if (!slug) {
      console.error('Slug is empty or undefined');
      return null;
    }

    const command = new ScanCommand({
      TableName: TABLE_NAME,
      FilterExpression: 'card_slug = :slug',
      ExpressionAttributeValues: {
        ':slug': slug,
      },
    });
    
    const response = await docClient.send(command);
    const contacts = response.Items as Contact[];
    
    return contacts && contacts.length > 0 ? contacts[0] : null;
  } catch (error) {
    console.error('Error getting contact by slug:', error);
    throw error;
  }
}

export async function createContact(contact: Omit<Contact, 'id' | 'created_at' | 'updated_at'>): Promise<Contact> {
  try {
    console.log('Creating contact with data:', contact);
    
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    
    const newContact: Contact = {
      id,
      ...contact,
      created_at: now,
      updated_at: now,
    };
    
    console.log('New contact object:', newContact);
    console.log('Using table:', TABLE_NAME);
    
    const command = new PutCommand({
      TableName: TABLE_NAME,
      Item: newContact,
    });
    
    console.log('Sending DynamoDB command...');
    const response = await docClient.send(command);
    console.log('DynamoDB response:', response);
    
    return newContact;
  } catch (error) {
    console.error('Error creating contact:', error);
    console.error('Error details:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    throw error;
  }
}

export async function updateContact(id: string, updates: Partial<Contact>): Promise<Contact> {
  try {
    const now = new Date().toISOString();
    const updatedContact = { ...updates, updated_at: now };
    
    // Build update expression
    const updateExpressions: string[] = [];
    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<string, any> = {};
    
    Object.entries(updatedContact).forEach(([key, value], index) => {
      const attrName = `#attr${index}`;
      const attrValue = `:val${index}`;
      updateExpressions.push(`${attrName} = ${attrValue}`);
      expressionAttributeNames[attrName] = key;
      expressionAttributeValues[attrValue] = value;
    });
    
    const command = new UpdateCommand({
      TableName: TABLE_NAME,
      Key: { id },
      UpdateExpression: `SET ${updateExpressions.join(', ')}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW',
    });
    
    const response = await docClient.send(command);
    return response.Attributes as Contact;
  } catch (error) {
    console.error('Error updating contact:', error);
    throw error;
  }
}

export async function deleteContact(id: string): Promise<void> {
  try {
    const command = new DeleteCommand({
      TableName: TABLE_NAME,
      Key: { id },
    });
    
    await docClient.send(command);
  } catch (error) {
    console.error('Error deleting contact:', error);
    throw error;
  }
}

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .slice(0, 50) + '-' + Math.random().toString(36).substring(7);
}