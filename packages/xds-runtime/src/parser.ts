/**
 * XDS (XTND Document Standard) Parser
 * Extracts metadata, versions, registers, and relation edges from canonical XDS Markdown.
 */

export interface XDSDocumentHeader {
  title: string;
  documentId?: string;
  version?: string;
  date?: string;
  organisation?: string;
  author?: string;
  status?: string;
  purpose?: string;
  basis?: string;
  decides?: string;
  classification?: string;
}

export interface XDSRegisterEntry {
  id: string;
  document: string;
  path: string;
  purpose: string;
  status: string;
  owner?: string;
}

export interface XDSInternalLink {
  text: string;
  targetPath: string;
  line: number;
}

export function parseXDSHeader(content: string): XDSDocumentHeader {
  const lines = content.split('\n');
  const result: XDSDocumentHeader = { title: '' };

  for (let i = 0; i < Math.min(lines.length, 30); i++) {
    const line = lines[i].trim();

    // H1 title: # XWORKSPACE — Vision and Mission
    if (line.startsWith('# ') && !result.title) {
      result.title = line.replace(/^#\s+/, '').trim();
      continue;
    }

    // Line 2 format: **XW-001 · Version 0.1.0 · 19 September 2026**
    const idVerMatch = line.match(/\*\*([A-Z]{2,4}-\d{3})\s*·\s*Version\s+([0-9.]+)\s*·\s*([^\\*]+)\*\*/i);
    if (idVerMatch) {
      result.documentId = idVerMatch[1];
      result.version = idVerMatch[2];
      result.date = idVerMatch[3].trim();
      continue;
    }

    // Line 3 format: **Organisation:** XTND DYNAMICS · **Author:** Peter A. Moelgaard · **Status:** Draft for review
    if (line.includes('**Organisation:**')) {
      const orgMatch = line.match(/\*\*Organisation:\*\*\s*([^·*]+)/);
      if (orgMatch) result.organisation = orgMatch[1].trim();

      const authorMatch = line.match(/\*\*Author:\*\*\s*([^·*]+)/);
      if (authorMatch) result.author = authorMatch[1].trim();

      const statusMatch = line.match(/\*\*Status:\*\*\s*([^·*]+)/);
      if (statusMatch) result.status = statusMatch[1].trim();
      continue;
    }

    // Document control table
    if (line.startsWith('|') && line.includes('Purpose')) {
      const parts = line.split('|').map(s => s.trim()).filter(Boolean);
      if (parts.length >= 2) result.purpose = parts[1];
    }
    if (line.startsWith('|') && line.includes('Basis')) {
      const parts = line.split('|').map(s => s.trim()).filter(Boolean);
      if (parts.length >= 2) result.basis = parts[1];
    }
    if (line.startsWith('|') && line.includes('Decides')) {
      const parts = line.split('|').map(s => s.trim()).filter(Boolean);
      if (parts.length >= 2) result.decides = parts[1];
    }
    if (line.startsWith('|') && line.includes('Classification')) {
      const parts = line.split('|').map(s => s.trim()).filter(Boolean);
      if (parts.length >= 2) result.classification = parts[1];
    }
  }

  return result;
}

export function parseXDSRegister(content: string): XDSRegisterEntry[] {
  const entries: XDSRegisterEntry[] = [];
  const lines = content.split('\n');
  let inTable = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('|') && trimmed.includes('ID') && trimmed.includes('Path')) {
      inTable = true;
      continue;
    }
    if (inTable) {
      if (!trimmed.startsWith('|') || trimmed.includes('---')) {
        if (!trimmed.startsWith('|')) inTable = false;
        continue;
      }
      const cols = trimmed.split('|').map(s => s.trim()).filter(Boolean);
      if (cols.length >= 5) {
        entries.push({
          id: cols[0],
          document: cols[1].replace(/\[(.*?)\]\(.*?\)/, '$1'),
          path: cols[2].replace(/[`<>()]/g, ''),
          purpose: cols[3],
          status: cols[4],
          owner: cols[5] || undefined
        });
      }
    }
  }
  return entries;
}

export function extractInternalLinks(content: string): XDSInternalLink[] {
  const links: XDSInternalLink[] = [];
  const lines = content.split('\n');
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    const line = lines[lineIndex];
    let match: RegExpExecArray | null;
    while ((match = linkRegex.exec(line)) !== null) {
      const text = match[1];
      const targetPath = match[2];
      // Skip pure external http web links when extracting internal document graph relations
      if (!targetPath.startsWith('http://') && !targetPath.startsWith('https://')) {
        links.push({
          text,
          targetPath: targetPath.replace(/^[<](.*)[>]$/, '$1'),
          line: lineIndex + 1
        });
      }
    }
  }
  return links;
}
