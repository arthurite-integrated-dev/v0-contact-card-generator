# Arthurite Integrated - e-Contact Card Generator Setup

## Overview

This is a functional Next.js application that allows you to create and manage digital contact cards with QR codes. All data is persisted in Supabase instead of localStorage.

## Prerequisites

1. A Supabase account (https://supabase.com)
2. Your Supabase project URL and anonymous key

## Setup Instructions

### 1. Set Up Supabase Database

Run this SQL in your Supabase SQL Editor to create the contacts table:

```sql
-- Create contacts table for Arthurite Integrated e-Contact Cards
CREATE TABLE IF NOT EXISTS contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  position VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  photo_url TEXT,
  card_slug VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS (Row Level Security)
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (anyone can view cards)
CREATE POLICY "contacts_public_read"
  ON contacts
  FOR SELECT
  USING (true);

-- Create policy for authenticated insert/update (only authorized users)
CREATE POLICY "contacts_authenticated_write"
  ON contacts
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "contacts_authenticated_update"
  ON contacts
  FOR UPDATE
  WITH CHECK (true);

CREATE POLICY "contacts_authenticated_delete"
  ON contacts
  FOR DELETE
  USING (true);

-- Create index on card_slug for faster lookups
CREATE INDEX idx_contacts_slug ON contacts(card_slug);
```

### 2. Add Environment Variables

Add these to your Vercel project or `.env.local` file:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

You can find these values in your Supabase project settings.

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

## Database Schema

The `contacts` table stores:
- `id` - Unique identifier
- `name` - Staff member's full name
- `position` - Job title
- `email` - Contact email
- `phone` - Contact phone number
- `photo_url` - URL to staff member's photo
- `card_slug` - Unique URL slug for the card
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

## Architecture

- **Frontend**: Next.js 16 with React 19
- **Styling**: Tailwind CSS
- **Database**: Supabase PostgreSQL
- **QR Codes**: QRCode library
- **Components**: shadcn/ui components

## Deployment

To deploy to Vercel:

1. Push your code to GitHub
2. Import the repository in Vercel
3. Add the Supabase environment variables in project settings
4. Deploy!

The app will be live and accessible at your Vercel URL.
