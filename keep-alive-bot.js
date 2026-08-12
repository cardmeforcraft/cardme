/**
 * CardMe Keep-Alive Bot
 * 
 * A self-contained, dependency-free Node.js script that pings the keep-alive
 * endpoint of the website to prevent Vercel Serverless Functions cold starts
 * and MongoDB Atlas connection idle sleep.
 * 
 * Usage:
 *   node keep-alive-bot.js
 * 
 * Environment Variables (optional):
 *   SITE_URL: The base URL of the site (default: http://localhost:3000)
 *   PING_INTERVAL_MINUTES: Time in minutes between pings (default: 5)
 */

const http = require('http');
const https = require('https');

// Configuration
const siteUrl = process.env.SITE_URL || 'http://localhost:3000';
const pingIntervalMinutes = parseFloat(process.env.PING_INTERVAL_MINUTES || '5');
const keepAlivePath = '/api/cron/keep-alive';

const fullUrl = `${siteUrl.replace(/\/$/, '')}${keepAlivePath}`;
const intervalMs = pingIntervalMinutes * 60 * 1000;

console.log('=============================================');
console.log('         CardMe Keep-Alive Bot               ');
console.log('=============================================');
console.log(`Target URL:     ${fullUrl}`);
console.log(`Ping Interval:  ${pingIntervalMinutes} minute(s) (${intervalMs}ms)`);
console.log('Starting execution loop...\n');

function pingEndpoint() {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] Sending ping request...`);

  const client = fullUrl.startsWith('https') ? https : http;
  const startTime = Date.now();

  const req = client.get(fullUrl, (res) => {
    let body = '';
    res.on('data', (chunk) => {
      body += chunk;
    });

    res.on('end', () => {
      const duration = Date.now() - startTime;
      console.log(`[${timestamp}] Status Code: ${res.statusCode} | Duration: ${duration}ms`);
      
      try {
        const parsed = JSON.parse(body);
        if (parsed.success) {
          console.log(`[${timestamp}] Response: Database ${parsed.database}, Products Count: ${parsed.productsCount}`);
        } else {
          console.warn(`[${timestamp}] Response Warning:`, parsed);
        }
      } catch (err) {
        console.log(`[${timestamp}] Response (Non-JSON):`, body.substring(0, 150));
      }
      console.log('---------------------------------------------');
    });
  });

  req.on('error', (err) => {
    const duration = Date.now() - startTime;
    console.error(`[${timestamp}] Error sending ping (after ${duration}ms):`, err.message);
    console.log('---------------------------------------------');
  });

  req.end();
}

// Perform initial ping immediately
pingEndpoint();

// Start periodic interval loop
const interval = setInterval(pingEndpoint, intervalMs);

// Handle graceful termination
process.on('SIGINT', () => {
  console.log('\nStopping keep-alive interval. Goodbye!');
  clearInterval(interval);
  process.exit(0);
});
