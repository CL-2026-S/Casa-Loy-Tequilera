import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { URL } from 'url'
import fs from 'fs'
import path from 'path'

// Middleware to run local Vercel serverless functions in Vite dev server
function localApiMiddleware() {
  return {
    name: 'local-api-middleware',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url.startsWith('/api/')) {
          const url = new URL(req.url, `http://${req.headers.host}`);
          const pathname = url.pathname;
          
          // Determine the JS file path in the api folder
          // E.g. /api/newsletter/subscribe -> ./api/newsletter/subscribe.js
          const apiFilePath = path.join(process.cwd(), `${pathname}.js`);
          
          if (!fs.existsSync(apiFilePath)) {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: `API route ${pathname} not found.` }));
            return;
          }
          
          try {
            // Read and parse request body for POST/PUT/PATCH requests
            if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
              const buffers = [];
              for await (const chunk of req) {
                buffers.push(chunk);
              }
              const data = Buffer.concat(buffers).toString();
              if (req.headers['content-type']?.includes('application/json')) {
                req.body = data ? JSON.parse(data) : {};
              } else {
                req.body = data;
              }
            }
            
            // Add query parameters to req.query
            const queryParams = {};
            url.searchParams.forEach((value, key) => {
              queryParams[key] = value;
            });
            req.query = queryParams;
            
            // Mock Vercel response API
            res.status = (code) => {
              res.statusCode = code;
              return res;
            };
            res.json = (data) => {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(data));
            };
            res.send = (data) => {
              if (typeof data === 'object') {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(data));
              } else {
                res.end(data);
              }
            };
            
            // Dynamic import the handler with a cache-buster to prevent ESM caching
            const fileUrl = `file://${apiFilePath.replace(/\\/g, '/')}`;
            const module = await import(`${fileUrl}?t=${Date.now()}`);
            const handler = module.default;
            
            await handler(req, res);
          } catch (err) {
            console.error(`Error executing local API handler for ${pathname}:`, err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: `Internal Server Error: ${err.message}` }));
          }
          return;
        }
        next();
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');
  
  // Assign them to process.env so the backend handlers can access them
  process.env.SUPABASE_URL = env.SUPABASE_URL || 'https://skftswhrzbekjkrcfffb.supabase.co';
  process.env.SUPABASE_SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;
  process.env.RESEND_API_KEY = env.RESEND_API_KEY;
  process.env.RESEND_FROM_EMAIL = env.RESEND_FROM_EMAIL;
  process.env.API_SECRET_KEY = env.API_SECRET_KEY;
  process.env.CRON_SECRET = env.CRON_SECRET;

  return {
    plugins: [react(), localApiMiddleware()],
  }
})

