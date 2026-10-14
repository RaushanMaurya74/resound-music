import fs from 'fs';
import path from 'path';

const SKIP_DIRS = new Set(['.git', 'node_modules', '.next', 'dist', 'build', 'replica']);
const BINARY_EXTS = new Set(['.png', '.jpg', '.jpeg', '.gif', '.ico', '.webp', '.mp3', '.wav', '.lock']);

function loadConfig(configPath) {
  return JSON.parse(fs.readFileSync(configPath, 'utf-8'));
}

function scanDir(dir, config, results = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      scanDir(fullPath, config, results);
    } else {
      const ext = path.extname(entry.name).toLowerCase();
      if (BINARY_EXTS.has(ext)) continue;

      const content = fs.readFileSync(fullPath, 'utf-8');
      const lines = content.split('\n');

      lines.forEach((line, lineNum) => {
        // Check avoided names
        for (const name of config.avoid || []) {
          const regex = new RegExp(`\\b${name}\\b`, 'i');
          if (regex.test(line)) {
            results.push({ file: fullPath, line: lineNum + 1, term: name, type: 'name', snippet: line.trim() });
          }
        }

        // Check domains
        for (const domain of config.domains || []) {
          if (line.toLowerCase().includes(domain.toLowerCase())) {
            results.push({ file: fullPath, line: lineNum + 1, term: domain, type: 'domain', snippet: line.trim() });
          }
        }

        // Check old brand colors
        for (const color of config.colors || []) {
          if (line.toLowerCase().includes(color.toLowerCase())) {
            results.push({ file: fullPath, line: lineNum + 1, term: color, type: 'color', snippet: line.trim() });
          }
        }
      });
    }
  }

  return results;
}

const config = loadConfig('replica/brand.json');
console.log(`\n========================================`);
console.log(`Running Rebrand Sweep against "${config.name}"...`);
console.log(`Checking for remnants of: ${config.avoid.join(', ')}`);
console.log(`========================================\n`);

const violations = scanDir('.', config);

if (violations.length === 0) {
  console.log(`  ✓ CLEAN SWEEP: Zero target brand names, domains, or colors found in source code.`);
  console.log(`========================================\n`);
  process.exit(0);
} else {
  console.error(`  ✗ SWEEP FAILED: Found ${violations.length} target brand remnants:`);
  violations.forEach(v => {
    console.error(`    - [${v.type}] ${v.file}:${v.line} -> "${v.term}" in: ${v.snippet}`);
  });
  console.log(`========================================\n`);
  process.exit(1);
}
