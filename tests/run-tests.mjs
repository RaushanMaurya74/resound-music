import http from 'http';

const BASE_URL = 'http://localhost:3000';

function request(path, options = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const req = http.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        let json = null;
        try { json = JSON.parse(data); } catch (e) {}
        resolve({ status: res.statusCode, headers: res.headers, body: data, json });
      });
    });
    req.on('error', reject);
    if (options.body) {
      req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
    }
    req.end();
  });
}

const tests = [];
function test(name, fn) {
  tests.push({ name, fn });
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

// -------------------------------------------------------------
// Test Cases
// -------------------------------------------------------------

// Flow 1: Home Feed & Discovery
test('F01-H1: Home route (/) returns 200 and loads HTML with player shell', async () => {
  const res = await request('/');
  assert(res.status === 200, `Expected 200, got ${res.status}`);
  assert(res.body.includes('Resound'), 'Missing Resound brand wordmark in HTML');
  assert(res.body.includes('Liked Songs'), 'Missing Liked Songs in home feed');
});

test('F01-API: GET /api/feed returns recents and shelves', async () => {
  const res = await request('/api/feed');
  assert(res.status === 200, `Expected 200, got ${res.status}`);
  assert(res.json && Array.isArray(res.json.recents), 'Missing recents array');
  assert(res.json.recents.length >= 4, 'Expected at least 4 recents');
  assert(Array.isArray(res.json.shelves), 'Missing shelves array');
});

// Flow 2: Search & Live Filter
test('F02-H1: Search route (/search) returns 200', async () => {
  const res = await request('/search');
  assert(res.status === 200, `Expected 200, got ${res.status}`);
  assert(res.body.includes('Browse all') || res.body.includes('Search'), 'Missing Browse all section in search page');
});

test('F02-API: GET /api/search?q=weeknd returns topResult and matching songs', async () => {
  const res = await request('/api/search?q=weeknd');
  assert(res.status === 200, `Expected 200, got ${res.status}`);
  assert(res.json && res.json.tracks.length > 0, 'No tracks matched "weeknd"');
  assert(res.json.tracks.some(t => t.title.toLowerCase().includes('blinding') || t.artistName.toLowerCase().includes('weeknd')), 'Expected Blinding Lights or The Weeknd');
});

test('F02-N1: GET /api/search with empty query returns 400 validation error', async () => {
  const res = await request('/api/search?q=');
  assert(res.status === 400, `Expected 400 for empty query, got ${res.status}`);
});

// Flow 3: Playlist Detail & Playlists API
test('F03-H1: Playlist route (/playlist/playlist-top-hits) returns 200 with playlist header', async () => {
  const res = await request('/playlist/playlist-top-hits');
  assert(res.status === 200, `Expected 200, got ${res.status}`);
  assert(res.body.includes("Top Hits"), "Missing Top Hits title in HTML");
});

test('F03-API: GET /api/playlists returns list of playlists', async () => {
  const res = await request('/api/playlists');
  assert(res.status === 200, `Expected 200, got ${res.status}`);
  assert(res.json && Array.isArray(res.json.playlists), 'Missing playlists array');
  assert(res.json.playlists.length >= 3, 'Expected at least 3 seeded playlists');
});

test('F03-API-POST: POST /api/playlists creates new playlist with zod validation', async () => {
  const res = await request('/api/playlists', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: { title: 'Integration Test Playlist', description: 'Created by automated e2e test', isPublic: true },
  });
  assert(res.status === 201, `Expected 201, got ${res.status}`);
  assert(res.json && res.json.playlist && res.json.playlist.title === 'Integration Test Playlist', 'Invalid created playlist data');
});

test('F03-API-N1: POST /api/playlists with empty title returns 400', async () => {
  const res = await request('/api/playlists', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: { title: '' },
  });
  assert(res.status === 400, `Expected 400 for empty title, got ${res.status}`);
});

// Flow 4 & 5: Album and Artist views
test('F04-H1: Album route (/album/album-1) returns 200 with After Hours', async () => {
  const res = await request('/album/album-1');
  assert(res.status === 200, `Expected 200, got ${res.status}`);
  assert(res.body.includes('After Hours'), 'Missing After Hours album title in HTML');
});

test('F05-H1: Artist route (/artist/artist-1) returns 200 with The Weeknd profile', async () => {
  const res = await request('/artist/artist-1');
  assert(res.status === 200, `Expected 200, got ${res.status}`);
  assert(res.body.includes('The Weeknd'), 'Missing The Weeknd artist name in HTML');
  assert(res.body.includes('monthly listeners'), 'Missing monthly listeners in HTML');
});

// Flow 6: Liked Songs Collection & Design Tokens
test('F06-H1: Liked Songs route (/collection/tracks) returns 200', async () => {
  const res = await request('/collection/tracks');
  assert(res.status === 200, `Expected 200, got ${res.status}`);
  assert(res.body.includes('Liked Songs'), 'Missing Liked Songs title in HTML');
});

test('DESIGN-H1: Design Tokens route (/design) returns 200', async () => {
  const res = await request('/design');
  assert(res.status === 200, `Expected 200, got ${res.status}`);
  assert(res.body.includes('Design Tokens'), 'Missing Design Tokens in HTML');
});

test('LAUNCH-H1: Marketing Landing route (/landing) returns 200 with Pure Music hero', async () => {
  const res = await request('/landing');
  assert(res.status === 200, `Expected 200, got ${res.status}`);
  assert(res.body.includes('Pure Music'), 'Missing Pure Music headline in /landing');
  assert(res.body.includes('Fisher-Yates'), 'Missing True Shuffle reference in /landing');
});

// Payments & Webhooks
test('PAY-H1: POST /api/checkout returns simulated/live checkout session URL', async () => {
  const res = await request('/api/checkout', { method: 'POST' });
  assert(res.status === 200, `Expected 200, got ${res.status}`);
  assert(res.json && res.json.url, 'Missing checkout url in response');
});

test('WEBHOOK-H1: POST /api/webhooks/stripe processes event with idempotency', async () => {
  const dummyEvent = {
    id: `evt_test_${Date.now()}`,
    type: 'checkout.session.completed',
    data: { object: { id: 'cs_test_123', customer: 'cus_test_123' } },
  };
  const res = await request('/api/webhooks/stripe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: dummyEvent,
  });
  assert(res.status === 200, `Expected 200, got ${res.status}`);
  assert(res.json && res.json.received === true, 'Webhook did not confirm received');

  // Second delivery must be flagged as duplicate
  const res2 = await request('/api/webhooks/stripe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: dummyEvent,
  });
  assert(res2.status === 200, `Expected 200 for duplicate, got ${res2.status}`);
  assert(res2.json && res2.json.duplicate === true, 'Expected idempotency duplicate flag');
});

// Legal & Compliance (replica-deploy preflight)
test('DEPLOY-LEGAL: GET /privacy and /terms return 200 with processors listed', async () => {
  const resPrivacy = await request('/privacy');
  assert(resPrivacy.status === 200, `Expected 200 for /privacy, got ${resPrivacy.status}`);
  assert(resPrivacy.body.includes('Supabase') && resPrivacy.body.includes('Stripe') && resPrivacy.body.includes('Vercel'), 'Missing processor disclosures in /privacy');

  const resTerms = await request('/terms');
  assert(resTerms.status === 200, `Expected 200 for /terms, got ${resTerms.status}`);
  assert(resTerms.body.includes('Terms of Service'), 'Missing Terms of Service in /terms');
});

test('DEPLOY-GDPR: POST /api/account/delete processes data erasure request', async () => {
  const res = await request('/api/account/delete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  assert(res.status === 200, `Expected 200, got ${res.status}`);
  assert(res.json && res.json.success === true, 'Failed to confirm account deletion request');
});

// -------------------------------------------------------------
// Runner
// -------------------------------------------------------------
async function run() {
  console.log(`\nStarting replica-test automated test suite against ${BASE_URL}...\n`);
  let passed = 0;
  let failed = 0;
  const failures = [];

  for (const { name, fn } of tests) {
    try {
      await fn();
      console.log(`  ✓ PASS: ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ✗ FAIL: ${name}`);
      console.error(`    Error: ${err.message}`);
      failed++;
      failures.push({ name, error: err.message });
    }
  }

  console.log(`\n========================================`);
  console.log(`Total: ${tests.length} | Passed: ${passed} | Failed: ${failed}`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

run();
