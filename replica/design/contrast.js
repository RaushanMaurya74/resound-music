#!/usr/bin/env node
const fs = require('fs');

const HEX = /^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
const NEEDS = { normal: [4.5, 7.0], large: [3.0, 4.5], ui: [3.0, 3.0] };

function parseHex(val) {
  let h = val.trim().replace('#', '');
  if (h.length === 3) h = h.split('').map(c => c + c).join('');
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

function luminance(rgb) {
  const chan = (c) => {
    c = c / 255.0;
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * chan(rgb[0]) + 0.7152 * chan(rgb[1]) + 0.0722 * chan(rgb[2]);
}

function ratio(fg, bg) {
  const la = luminance(parseHex(fg));
  const lb = luminance(parseHex(bg));
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

function check(tokens) {
  const cols = tokens.color || {};
  const pairs = tokens.pairs || [];
  const rows = [];

  for (const p of pairs) {
    const [fg, bg, sizeKey = 'normal'] = p;
    const size = NEEDS[sizeKey] ? sizeKey : 'normal';
    if (!cols[fg] || !cols[bg]) {
      rows.push({ fg, bg, size, error: 'unknown token' });
      continue;
    }
    const r = ratio(cols[fg], cols[bg]);
    const [aa, aaa] = NEEDS[size];
    rows.push({
      fg,
      bg,
      size,
      ratio: Math.round(r * 100) / 100,
      aa: r >= aa,
      aaa: r >= aaa,
      fg_hex: cols[fg],
      bg_hex: cols[bg]
    });
  }
  return rows;
}

function render(rows) {
  const lines = [];
  for (const r of rows) {
    if (r.error) {
      lines.push(`  ??    ${r.fg.padEnd(24)} on ${r.bg.padEnd(20)} ${r.error}`);
      continue;
    }
    const grade = r.size === 'ui' ? (r.aa ? 'PASS' : 'FAIL') : (r.aaa ? 'AAA ' : (r.aa ? 'AA  ' : 'FAIL'));
    lines.push(`  ${grade} ${r.ratio.toFixed(2).padStart(5)}:1  ${r.fg.padEnd(24)} on ${r.bg.padEnd(20)} ${r.size === 'normal' ? '' : r.size}`);
  }
  const fails = rows.filter(r => r.error || !r.aa).length;
  lines.push('');
  lines.push(`  ${rows.length} pairs, ${fails} failing AA`);
  return { text: lines.join('\n'), fails };
}

const file = process.argv[2] || 'tokens.json';
const tokens = JSON.parse(fs.readFileSync(file, 'utf-8'));
const rows = check(tokens);
const { text, fails } = render(rows);
console.log(text);
process.exit(fails > 0 ? 1 : 0);
