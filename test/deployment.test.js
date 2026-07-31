const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const dockerfile = readFileSync(path.join(root, 'Dockerfile'), 'utf8');
const compose = readFileSync(path.join(root, 'docker-compose.yml'), 'utf8');
const dockerIgnore = readFileSync(path.join(root, '.dockerignore'), 'utf8');

test('runs the application as the unprivileged Node user', () => {
  assert.match(dockerfile, /apt-get install -y --no-install-recommends openssl/);
  assert.match(dockerfile, /COPY --chown=node:node \. \.\n\nUSER node\n/);
  assert.match(compose, /user: node/);
  assert.match(compose, /no-new-privileges:true/);
});

test('injects secrets at runtime and does not mount source or anonymous dependencies', () => {
  assert.match(dockerIgnore, /^\.env$/m);
  assert.match(compose, /env_file:\n\s+- \.env/);
  assert.doesNotMatch(compose, /volumes:/);
});
