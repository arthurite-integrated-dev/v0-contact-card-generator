# Arthurite Integrated - e-Contact Card Generator Setup (DynamoDB)

## Overview

This is a functional Next.js application that allows you to create and manage digital contact cards with QR codes. All data is persisted in AWS DynamoDB.

## Prerequisites

1. An AWS account with DynamoDB access
2. AWS credentials (Access Key ID and Secret Access Key)
3. Node.js and npm installed

## Setup Instructions

### 1. Set Up AWS DynamoDB Table

#### Option A: Using AWS Console
1. Go to AWS DynamoDB Console
2. Click "Create table"
3. Set table name: `contacts` (or your preferred name)
4. Set partition key: `id` (String)
5. Leave sort key empty
6. Use default settings for the rest
7. Click "Create table"

#### Option B: Using AWS CLI
```bash
aws dynamodb create-table \
    --table-name contacts \
    --attribute-definitions \
        AttributeName=id,AttributeType=S \
        AttributeName=card_slug,AttributeType=S \
    --key-schema \
        AttributeName=id,KeyType=HASH \
    --global-secondary-indexes \
        IndexName=SlugIndex,KeySchema=[{AttributeName=card_slug,KeyType=HASH}],Projection={ProjectionType=ALL},ProvisionedThroughput={ReadCapacityUnits=5,WriteCapacityUnits=5} \
    --provisioned-throughput \
        ReadCapacityUnits=5,WriteCapacityUnits=5
```

### 2. Set Up AWS Credentials

#### Option A: Environment Variables
Add these to your `.env.local` file:

```
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key
DYNAMODB_TABLE_NAME=contacts
```

#### Option B: AWS Credentials File
Create `~/.aws/credentials`:
```
[default]
aws_access_key_id = your_access_key_id
aws_secret_access_key = your_secret_access_key
```

And `~/.aws/config`:
```
[default]
region = us-east-1
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run the Application

```bash
npm run dev
```

Visit `http://localhost:3000` to start using the app.

## Features

### Admin Dashboard
- Add new staff members with name, position, email, phone, and photo
- View all created contacts
- Delete contacts
- Each contact gets a unique URL slug automatically generated

### Contact Cards
- Professional digital contact cards with company branding
- QR codes for easy sharing (scan to access the contact card)
- Responsive design that works on all devices
- Each card has its own unique URL

### QR Codes
- Each contact card generates a unique QR code
- QR codes link to that specific contact's shareable URL
- Designed with Arthurite's brand colors

## How to Use

1. **Add a Contact**: Fill in the admin form with staff member details and click "Add Contact"
2. **Share the Card**: Copy the unique card slug URL and share it with others
3. **Generate QR Code**: The card automatically displays a QR code that can be scanned
4. **View Public Card**: Anyone can scan the QR code or visit the unique URL to see the contact card

## DynamoDB Schema

The `contacts` table stores:
- `id` (String, Partition Key) - Unique identifier (UUID)
- `name` (String) - Staff member's full name
- `position` (String) - Job title
- `email` (String) - Contact email
- `phone` (String, nullable) - Contact phone number
- `photo_url` (String, nullable) - URL to staff member's photo
- `card_slug` (String) - Unique URL slug for the card
- `created_at` (String) - Creation timestamp (ISO string)
- `updated_at` (String) - Last update timestamp (ISO string)

## Architecture

- **Frontend**: Next.js 16 with React 19
- **Styling**: Tailwind CSS
- **Database**: AWS DynamoDB
- **QR Codes**: QRCode library
- **Components**: shadcn/ui components

## AWS IAM Permissions

Your AWS user/role needs these DynamoDB permissions:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "dynamodb:PutItem",
                "dynamodb:GetItem",
                "dynamodb:Scan",
                "dynamodb:UpdateItem",
                "dynamodb:DeleteItem"
            ],
            "Resource": "arn:aws:dynamodb:*:*:table/contacts"
        }
    ]
}
```

## Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Import the repository in Vercel
3. Add the AWS environment variables in project settings:
   - `AWS_REGION`
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`
   - `DYNAMODB_TABLE_NAME`
4. Deploy!

### AWS Lambda Deployment

For serverless deployment, you can also deploy this as AWS Lambda functions using frameworks like Serverless or AWS CDK.

## Cost Considerations

- DynamoDB pricing is based on read/write capacity and storage
- For small applications, the AWS Free Tier includes 25 GB of storage and 25 read/write capacity units
- Consider using on-demand billing for unpredictable workloads

## Troubleshooting

### Common Issues

1. **Access Denied**: Check your AWS credentials and IAM permissions
2. **Table Not Found**: Ensure the DynamoDB table exists and the table name matches your environment variable
3. **Region Mismatch**: Make sure your AWS region is correctly set in environment variables

### Debug Mode

Add this to your environment variables for detailed AWS SDK logging:
```
AWS_SDK_JS_LOG=1
```