import assert from 'node:assert/strict';
import { test } from 'node:test';

import { readFile } from 'node:fs/promises';
import ts from 'typescript';

const source = await readFile(new URL('./prefixFileUrlWithBackendUrl.ts', import.meta.url), 'utf8');
const javascript = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText;
const { prefixFileUrlWithBackendUrl } = await import(`data:text/javascript,${encodeURIComponent(javascript)}`);

test('joins media paths to backend URLs with exactly one separator', () => {
    assert.equal(prefixFileUrlWithBackendUrl('/uploads/image.png', '/'), '/uploads/image.png');
    assert.equal(prefixFileUrlWithBackendUrl('/uploads/image.png', 'https://cms.example/'), 'https://cms.example/uploads/image.png');
    assert.equal(prefixFileUrlWithBackendUrl('uploads/image.png', 'https://cms.example'), 'https://cms.example/uploads/image.png');
    assert.equal(prefixFileUrlWithBackendUrl('/uploads/image.png', ''), '/uploads/image.png');
    assert.equal(prefixFileUrlWithBackendUrl('https://cdn.example/image.png', '/'), 'https://cdn.example/image.png');
});
