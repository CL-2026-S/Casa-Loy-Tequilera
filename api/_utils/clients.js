import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

// Initialize Supabase Client
const supabaseUrl = process.env.SUPABASE_URL || 'https://skftswhrzbekjkrcfffb.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNrZnRzd2hyemJla2prcmNmZmZiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTU3MzQ0NSwiZXhwIjoyMDk3MTQ5NDQ1fQ.JCJj2naXLlhnkeJLlJjm-toLHghEfTmIiN-hxx-CRkc';

// Check if the keys are valid (and not placeholder templates)
const isSupabaseValid = supabaseUrl && supabaseServiceKey && supabaseServiceKey.startsWith('eyJ');
export const supabase = isSupabaseValid 
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      }
    })
  : null;

// Initialize Resend Client (Resend keys usually start with 're_')
const resendApiKey = process.env.RESEND_API_KEY || 're_QRNSi3Pz_CyDrLXo78jB1qjdgCevpVYq8';
const isResendValid = resendApiKey && resendApiKey.startsWith('re_');
export const resend = isResendValid ? new Resend(resendApiKey) : null;

// Helper to check authorization for internal calls (like welcome email called from subscribe)
export function authorizeInternal(req) {
  const authHeader = req.headers.authorization;
  const secretKey = process.env.API_SECRET_KEY || 'dev_secret_key';
  if (!secretKey) return true; // Fallback if not configured in dev
  return authHeader === `Bearer ${secretKey}`;
}

// Helper to check authorization for Cron jobs
export function authorizeCron(req) {
  const authHeader = req.headers.authorization;
  const cronSecret = process.env.CRON_SECRET || 'dev_cron_secret';
  
  // Vercel Crons pass a bearer token equal to CRON_SECRET, or x-vercel-cron header
  if (req.headers['x-vercel-cron'] === '1') {
    return true;
  }
  if (!cronSecret) return true; // Fallback if not configured in dev
  return authHeader === `Bearer ${cronSecret}`;
}

// Helper to get sender email
export function getFromEmail() {
  return process.env.RESEND_FROM_EMAIL || 'Casa Loy <onboarding@resend.dev>';
}

// Helper to get site URL for absolute paths
export function getSiteUrl(req) {
  // If the request has a host header, use it to dynamically match the active domain (e.g. casaloy.com)
  if (req && req.headers && req.headers.host) {
    const host = req.headers.host;
    const isLocal = host.includes('localhost') || host.includes('127.0.0.1');
    const protocol = req.headers['x-forwarded-proto'] || (isLocal ? 'http' : 'https');
    return `${protocol}://${host}`;
  }
  // Fallback to VERCEL_URL if host header is not available
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return 'https://casaloy.com';
}
