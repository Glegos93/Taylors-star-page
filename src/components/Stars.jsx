import { useEffect, useState } from 'react';
import starImg from '../assets/star.png';

function parseCSV(text) {
  const lines = text.split(/\r?\n/).filter(Boolean);
  if (lines.length === 0) return [];
  const fields = [];

  // simple CSV parser that handles quoted fields where quotes are doubled
  function parseLine(line) {
    const out = [];
    let i = 0;
    while (i < line.length) {
      if (line[i] === '"') {
        i++;
        let field = '';
        while (i < line.length) {
          if (line[i] === '"' && line[i + 1] === '"') {
            field += '"';
            i += 2;
            continue;
          }
          if (line[i] === '"') {
            i++;
            break;
          }
          field += line[i++];
        }
        // skip optional comma
        if (line[i] === ',') i++;
        out.push(field);
      } else {
        // unquoted
        const idx = line.indexOf(',', i);
        if (idx === -1) {
          out.push(line.slice(i));
          break;
        }
        out.push(line.slice(i, idx));
        i = idx + 1;
      }
    }
    return out;
  }

  const header = parseLine(lines[0]);
  for (let i = 1; i < lines.length; i++) {
    const parsed = parseLine(lines[i]);
    if (parsed.length === 0) continue;
    const obj = {};
    for (let j = 0; j < header.length; j++) {
      obj[header[j]] = parsed[j] ?? '';
    }
    fields.push(obj);
  }
  return fields;
}

function hashToPercent(s, seed = 0) {
  // DJB2-ish hash -> two percentages
  let h = 5381 + seed;
  for (let i = 0; i < s.length; i++) h = (h * 33) ^ s.charCodeAt(i);
  h = Math.abs(h >>> 0);
  return (h % 10000) / 100; // 0..100
}

export default function Stars() {
  const [stars, setStars] = useState([]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch('http://localhost:4000/submissions.csv');
        if (!res.ok) return;
        const text = await res.text();
        const rows = parseCSV(text);
        // compute stable positions based on name+email
        const mapped = rows.map((r, i) => {
          const key = `${r.name || ''}|${r.email || ''}|${i}`;
          const x = hashToPercent(key, 1);
          const y = hashToPercent(key, 2);
          return { ...r, x, y };
        });
        if (!cancelled) setStars(mapped);
      } catch (err) {
        // ignore
      }
    }
    load();
    const iv = setInterval(load, 10_000); // refresh every 10s so new submissions appear
    return () => {
      cancelled = true;
      clearInterval(iv);
    };
  }, []);

  if (!stars || stars.length === 0) return null;

  return (
    <div className="star-field" aria-hidden={false}>
      {stars.map((s, i) => (
        <div
          key={i}
          className="star"
          style={{ left: `${s.x}%`, top: `${s.y}%` }}
          tabIndex={0}
          aria-label={`${s.name} — ${s.chapter} — ${s.email}`}
        >
          <img src={starImg} alt="" className="star-img" />
          <span className="tooltip">
            <strong>{s.name}</strong>
            <div>{s.chapter}</div>
            <div>{s.email}</div>
            <div style={{ fontSize: 11, opacity: 0.8 }}>{s.submittedAt}</div>
          </span>
        </div>
      ))}
    </div>
  );
}
