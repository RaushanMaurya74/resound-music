import fs from 'fs';
import path from 'path';

const WEIGHT = { must: 3, should: 2, could: 1, p0: 3, p1: 2, p2: 1 };
const CREDIT = { yes: 1.0, done: 1.0, partial: 0.5, no: 0.0, '': 0.0, todo: 0.0 };

function parseCSV(content) {
  const lines = content.trim().split(/\r?\n/);
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    
    // Simple CSV parser handling quotes
    const values = [];
    let current = '';
    let inQuotes = false;
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());

    const row = {};
    headers.forEach((h, idx) => {
      row[h] = values[idx] || '';
    });
    rows.push(row);
  }
  return rows;
}

function calculateParity(csvPath) {
  const content = fs.readFileSync(csvPath, 'utf-8');
  const rows = parseCSV(content);

  const counted = [];
  const skipped = [];
  const extras = [];

  let mustTotal = 0;
  let mustDone = 0;

  for (const r of rows) {
    const orig = (r.original || 'yes').toLowerCase();
    const clone = (r.clone || '').toLowerCase();
    const prio = (r.priority || 'could').toLowerCase();

    if (orig === 'no') {
      extras.push(r);
      continue;
    }
    if (clone === 'skip') {
      skipped.push(r);
      continue;
    }

    const w = WEIGHT[prio] || 1;
    const c = CREDIT[clone] || 0.0;

    if (prio === 'must') {
      mustTotal++;
      if (c === 1.0) mustDone++;
    }

    counted.push({ ...r, weight: w, credit: c });
  }

  const totalPossible = counted.reduce((sum, r) => sum + r.weight, 0);
  const totalEarned = counted.reduce((sum, r) => sum + (r.weight * r.credit), 0);
  const score = totalPossible > 0 ? (totalEarned / totalPossible) * 100 : 0;

  // Breakdown by area
  const areas = {};
  for (const r of counted) {
    const a = r.area || 'general';
    if (!areas[a]) areas[a] = { earned: 0, possible: 0, count: 0 };
    areas[a].earned += r.weight * r.credit;
    areas[a].possible += r.weight;
    areas[a].count++;
  }

  // Missing or partial list
  const missing = counted.filter(r => r.credit < 1.0).sort((a, b) => b.weight - a.weight);

  return {
    score: Math.round(score * 10) / 10,
    mustDone,
    mustTotal,
    totalCounted: counted.length,
    skippedCount: skipped.length,
    areas,
    missing,
    skipped
  };
}

const csvFile = process.argv[2] || 'replica/features.csv';
const res = calculateParity(csvFile);

console.log(`\n========================================`);
console.log(`Feature Parity Score: ${res.score}%`);
console.log(`Must-haves Done: ${res.mustDone} / ${res.mustTotal}`);
console.log(`Status: ${res.mustDone === res.mustTotal && res.score >= 80 ? 'SHIPPABLE' : 'NOT SHIPPABLE'}`);
console.log(`========================================\n`);

console.log(`Area Breakdown:`);
for (const [area, data] of Object.entries(res.areas)) {
  const areaScore = Math.round((data.earned / data.possible) * 100);
  console.log(`  - ${area.padEnd(16)}: ${areaScore}% (${data.count} features)`);
}

if (res.missing.length > 0) {
  console.log(`\nRemaining Gaps:`);
  res.missing.forEach(m => {
    console.log(`  [${m.priority}] ${m.feature} (${m.clone}): ${m.notes || 'In progress'}`);
  });
}
