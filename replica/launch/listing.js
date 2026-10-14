import fs from 'fs';
import path from 'path';

const LIMITS = {
  app_store: {
    name: 30,
    subtitle: 30,
    promotional_text: 170,
    description: 4000,
    keywords: 100,
    whats_new: 4000,
  },
  google_play: {
    title: 30,
    short_description: 80,
    full_description: 4000,
  },
};

const SHORT_FIELDS = new Set(['name', 'subtitle', 'title', 'short_description']);
const CLAIMS = /(#\s?1\b|\bnumber one\b|\bno\.? ?1\b|\bbest\b|\btop[- ]rated\b|\b(app|game) of the year\b|\bfree\b|\bdiscount\b|\bsale\b|\b\d+% off\b|\bnew!?$)/i;
const STOP = new Set(['a', 'an', 'and', 'app', 'for', 'the', 'to', 'of', 'with', 'your', 'you', 'in', 'on', '&']);

function length(text) {
  return (text || '').normalize('NFC').length;
}

function hasEmoji(text) {
  return /[\u{1F300}-\u{1F9FF}]/u.test(text || '');
}

function words(text) {
  return ((text || '').toLowerCase().match(/[a-z0-9']+/g) || []).filter(w => !STOP.has(w));
}

function lint(listing, avoid = []) {
  const issues = [];
  const avoidList = (avoid || listing.avoid || []).map(a => a.trim()).filter(Boolean);

  function add(level, store, field, msg) {
    issues.push({ level, store, field, message: msg });
  }

  let foundStore = false;
  for (const [store, limits] of Object.entries(LIMITS)) {
    const data = listing[store];
    if (!data) continue;
    foundStore = true;

    for (const [field, limit] of Object.entries(limits)) {
      const value = data[field] || '';
      const n = length(value);

      if (!value) {
        const level = ['name', 'title', 'description', 'full_description'].includes(field) ? 'error' : 'warn';
        add(level, store, field, 'empty');
        continue;
      }

      if (n > limit) {
        add('error', store, field, `${n} characters, limit is ${limit} (${n - limit} over)`);
      }

      for (const name of avoidList) {
        const regex = new RegExp(`(?<!\\w)${name}(?!\\w)`, 'i');
        if (regex.test(value)) {
          add('error', store, field, `mentions '${name}'. Avoid terms must not appear in listing.`);
        }
      }

      if (SHORT_FIELDS.has(field)) {
        const m = value.match(CLAIMS);
        if (m) {
          add('warn', store, field, `'${m[0].trim()}' reads as a ranking or price claim.`);
        }
        if (hasEmoji(value)) {
          add('warn', store, field, 'emoji in a short field.');
        }
        const caps = value.match(/\b[A-Z]{4,}\b/g);
        if (caps) {
          add('warn', store, field, `all-caps word(s): ${caps.join(', ')}`);
        }
      }
    }

    if (store === 'app_store' && data.keywords) {
      const kwRaw = data.keywords;
      const parts = kwRaw.split(',').map(k => k.trim().toLowerCase());

      if (/,\s/.test(kwRaw)) {
        add('warn', store, 'keywords', 'spaces after commas waste characters. Use word1,word2,word3');
      }

      const dupes = [...new Set(parts.filter((k, i, arr) => k && arr.indexOf(k) !== i))];
      if (dupes.length > 0) {
        add('warn', store, 'keywords', `repeated: ${dupes.join(', ')}`);
      }

      const inName = new Set([...words(data.name || ''), ...words(data.subtitle || '')]);
      const wasted = [...new Set(parts.flatMap(k => words(k)).filter(w => inName.has(w)))];
      if (wasted.length > 0) {
        add('warn', store, 'keywords', `already in name/subtitle: ${wasted.join(', ')}`);
      }

      if (parts.some(k => !k)) {
        add('warn', store, 'keywords', 'empty entry (double comma or trailing comma)');
      }
    }
  }

  if (!foundStore) {
    add('error', '-', '-', 'no app_store or google_play section found');
  }

  return issues;
}

const targetPath = process.argv[2] || 'replica/launch/listing.json';
const listing = JSON.parse(fs.readFileSync(targetPath, 'utf-8'));
const issues = lint(listing);

console.log(`\n========================================`);
console.log(`Linting Store Listing: ${targetPath}`);
console.log(`========================================\n`);

const errors = issues.filter(i => i.level === 'error');
const warnings = issues.filter(i => i.level === 'warn');

if (issues.length === 0) {
  console.log(`✓ 0 errors, 0 warnings. Store listing is fully compliant!`);
  console.log(`========================================\n`);
  process.exit(0);
} else {
  issues.forEach(i => {
    const symbol = i.level === 'error' ? '✗' : '⚠';
    console.log(`  ${symbol} [${i.level.toUpperCase()}] ${i.store}.${i.field}: ${i.message}`);
  });
  console.log(`\nFound ${errors.length} error(s) and ${warnings.length} warning(s).`);
  console.log(`========================================\n`);
  process.exit(errors.length > 0 ? 1 : 0);
}
