-- SQL Migration for Casa Loy Newsletter Database Schema

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create subscribers table
CREATE TABLE IF NOT EXISTS subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed')),
    source_page TEXT,
    welcome_email_sent BOOLEAN DEFAULT false,
    monthly_newsletter BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create email_events table
CREATE TABLE IF NOT EXISTS email_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subscriber_id UUID REFERENCES subscribers(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL CHECK (event_type IN ('signup', 'welcome_email_sent', 'newsletter_sent', 'email_open', 'click')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Optional table to make blog articles dynamically manageable by campaign automation
CREATE TABLE IF NOT EXISTS blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    label TEXT NOT NULL,
    image_url TEXT NOT NULL,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for optimization
CREATE INDEX IF NOT EXISTS idx_subscribers_email ON subscribers(email);
CREATE INDEX IF NOT EXISTS idx_subscribers_status ON subscribers(status);
CREATE INDEX IF NOT EXISTS idx_email_events_subscriber ON email_events(subscriber_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Create policies for Serverless Backend (which uses service_role key to bypass RLS, but standard keys have read access)
-- Anonymous/Authenticated users cannot modify or see subscriber data directly from frontend client for security.
-- We only allow service_role key (used by our API routes) full access.

-- Policy for blog posts: Public read access
CREATE POLICY "Allow public read access to blog posts" 
    ON blog_posts FOR SELECT 
    USING (true);
