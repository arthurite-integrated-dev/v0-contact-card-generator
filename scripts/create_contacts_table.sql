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
