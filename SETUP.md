# Arthurite Integrated - e-Contact Card Generator Setup

## Overview

This is a functional Next.js application that allows you to create and manage digital contact cards with QR codes. All data is persisted in AWS DynamoDB.

**⚠️ IMPORTANT: This project now uses DynamoDB instead of Supabase. Please see [SETUP-DYNAMODB.md](./SETUP-DYNAMODB.md) for the complete setup instructions.**

## Quick Start

1. Set up AWS DynamoDB table (see SETUP-DYNAMODB.md)
2. Configure AWS credentials
3. Install dependencies: `npm install`
4. Run the app: `npm run dev`

## Migration from Supabase

If you're migrating from the previous Supabase version:
1. Export your data from Supabase
2. Follow the DynamoDB setup instructions
3. Import your data to DynamoDB

For detailed instructions, see [SETUP-DYNAMODB.md](./SETUP-DYNAMODB.md).
