import test from 'node:test';
import assert from 'node:assert/strict';
import { escapeHtml, slugify, validateFolderName, yamlString } from '../bin/helpers.mjs';

test('slugify converts Hungarian characters and spaces to a stable slug', () => {
  assert.equal(slugify('Árvíztűrő Tükörfúrógép védés'), 'arvizturo-tukorfurogep-vedes');
});

test('slugify provides a fallback for empty strings', () => {
  assert.equal(slugify('!!!'), 'slidev-vedes');
});

test('escapeHtml prevents markup injection in inserted values', () => {
  assert.equal(escapeHtml(`<tag a="'">&`), '&lt;tag a=&quot;&#39;&quot;&gt;&amp;');
});

test('yamlString returns a valid quoted scalar', () => {
  assert.equal(yamlString('Cím: "teszt"'), '"Cím: \\"teszt\\""');
});

test('validateFolderName accepts a basic folder name and blocks paths', () => {
  assert.equal(validateFolderName('sajat-vedes').ok, true);
  assert.equal(validateFolderName('../valami').ok, false);
  assert.equal(validateFolderName('folder/name').ok, false);
});
