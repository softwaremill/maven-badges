// Common Maven qualifiers in order
const QUALIFIERS = [
  'alpha', 'a',
  'beta', 'b',
  'milestone', 'm',
  'rc', 'cr',
  'snapshot',
  '', 'ga', 'final',
  'sp'
];

function normalizeQualifier(q: string): string {
  q = q.toLowerCase();
  if (q === 'cr') return 'rc';
  if (q === 'final' || q === 'ga') return '';
  return q;
}

function qualifierRank(q: string): number {
  const idx = QUALIFIERS.indexOf(normalizeQualifier(q));
  return idx === -1 ? QUALIFIERS.length : idx;
}

function splitVersion(version: string): string[] {
  // Split by dot, hyphen, or transition between digit and letter
  const parts: string[] = [];
  let buf = '';
  let lastType: 'digit'|'alpha'|null = null;
  for (let i = 0; i < version.length; i++) {
    const c = version[i];
    if (c === '.' || c === '-') {
      if (buf) parts.push(buf);
      buf = '';
      lastType = null;
      continue;
    }
    const isDigit = c >= '0' && c <= '9';
    const type = isDigit ? 'digit' : 'alpha';
    if (lastType && type !== lastType) {
      if (buf) parts.push(buf);
      buf = '';
    }
    buf += c;
    lastType = type;
  }
  if (buf) parts.push(buf);
  // Convert digit parts to numbers
  return parts.map(p => p.toString());
}

export class ComparableVersion {
  private parts: string[];
  constructor(public version: string) {
    this.parts = splitVersion(version);
  }

  compareTo(other: ComparableVersion): number {
    const a = this.parts;
    const b = other.parts;
    const len = Math.max(a.length, b.length);
    for (let i = 0; i < len; i++) {
      const x = a[i] !== undefined ? a[i] : '0';
      const y = b[i] !== undefined ? b[i] : '0';
      // Try to compare as numbers first
      const xNum = Number(x);
      const yNum = Number(y);
      const xIsNum = !isNaN(xNum);
      const yIsNum = !isNaN(yNum);
      if (xIsNum && yIsNum) {
        if (xNum !== yNum) return xNum - yNum;
      } else if (!xIsNum && !yIsNum) {
        const xq = qualifierRank(x);
        const yq = qualifierRank(y);
        if (xq !== QUALIFIERS.length || yq !== QUALIFIERS.length) {
          // At least one is a known qualifier
          if (xq !== yq) return xq - yq;
        } else {
          // Both are unknown, compare lexically
          const cmp = x.localeCompare(y);
          if (cmp !== 0) return cmp;
        }
      } else if (xIsNum) {
        // number > string (qualifier)
        return 1;
      } else {
        // string (qualifier) < number
        return -1;
      }
    }
    return 0;
  }
}