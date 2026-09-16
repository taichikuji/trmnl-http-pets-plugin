import { readFileSync } from 'node:fs';
import { expect, test } from 'bun:test';

const source = readFileSync(new URL('../TRMNL/src/transform.js', import.meta.url), 'utf8');

function loadTransform() {
  const deterministicMath = Object.create(Math);
  deterministicMath.random = () => 0;
  return new Function('Math', `${source}\nreturn run;`)(deterministicMath);
}

test('uses the selected pet source', () => {
  const result = loadTransform()({ pet_type: 'dogs' });

  expect(result.plugin_name).toBe('HTTP Dogs');
  expect(result.image_url).toMatch(/^https:\/\/http\.dog\/100\.jpg$/);
  expect(result.favicon).toBe('https://http.dog/favicon.ico');
});

test('reads pet selection from TRMNL custom fields', () => {
  const result = loadTransform()({
    trmnl: { plugin_settings: { custom_fields_values: { pet_type: 'fish' } } }
  });

  expect(result.plugin_name).toBe('HTTP Fish');
  expect(result.image_url).toMatch(/^https:\/\/http\.fish\/100\.jpg$/);
});

test('falls back safely for missing or invalid pet selections', () => {
  const run = loadTransform();

  expect(run({}).plugin_name).toBe('HTTP Cats');
  expect(run({ pet_type: 'not-a-pet' }).plugin_name).toBe('HTTP Cats');
});
