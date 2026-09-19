import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseXDSHeader, parseXDSRegister, extractInternalLinks } from '../src/parser.ts';

const SAMPLE_XW_001 = `# XWORKSPACE — Vision and Mission

**XW-001 · Version 0.1.0 · 19 September 2026**
**Organisation:** XTND DYNAMICS · **Author:** Peter A. Moelgaard · **Status:** Draft for review

| Document control | |
|---|---|
| Purpose | Fix the scope of XWORKSPACE before implementation begins |
| Basis | Scoping interview, 19 September 2026 |
| Decides | Vision, mission, scope boundary, R1 capability set |
| Classification | Internal |
`;

const SAMPLE_REGISTER = `# XWORKSPACE — document register

| ID | Document | Path | Purpose | Status | Owner |
|---|---|---|---|---|---|
| XW-001 | Vision and Mission | \`00-Foundation/XWORKSPACE-Vision-and-Mission.md\` | Vision, mission, twelve fixed scope decisions | Draft for review | PAM |
| XW-002 | Design System | \`01-Design/XWORKSPACE-Design-System-Brief.md\` | Scope, requirements Q-01 to Q-21 | Draft for issue | PAM |
`;

test('parseXDSHeader extracts document ID, version, author and metadata', () => {
  const header = parseXDSHeader(SAMPLE_XW_001);
  assert.equal(header.title, 'XWORKSPACE — Vision and Mission');
  assert.equal(header.documentId, 'XW-001');
  assert.equal(header.version, '0.1.0');
  assert.equal(header.author, 'Peter A. Moelgaard');
  assert.equal(header.status, 'Draft for review');
  assert.equal(header.purpose, 'Fix the scope of XWORKSPACE before implementation begins');
});

test('parseXDSRegister extracts register rows into structured entries', () => {
  const entries = parseXDSRegister(SAMPLE_REGISTER);
  assert.equal(entries.length, 2);
  assert.equal(entries[0].id, 'XW-001');
  assert.equal(entries[0].path, '00-Foundation/XWORKSPACE-Vision-and-Mission.md');
  assert.equal(entries[0].owner, 'PAM');
  assert.equal(entries[1].id, 'XW-002');
});

test('extractInternalLinks finds relative and file links for graph relation derivation', () => {
  const doc = 'Check [Vision](00-Foundation/XWORKSPACE-Vision-and-Mission.md) and [External](https://google.com).';
  const links = extractInternalLinks(doc);
  assert.equal(links.length, 1);
  assert.equal(links[0].text, 'Vision');
  assert.equal(links[0].targetPath, '00-Foundation/XWORKSPACE-Vision-and-Mission.md');
});
