import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import resolver from '../src/resolver';

describe('resolver', () => {
  it('maps add/del per package manager', () => {
    assert.equal(resolver('npm add typescript'), 'npm install typescript');
    assert.equal(resolver('yarn add typescript'), 'yarn add typescript');
    assert.equal(resolver('npm del typescript'), 'npm uninstall typescript');
    assert.equal(resolver('pnpm remove typescript'), 'pnpm remove typescript');
    assert.equal(resolver('bun uninstall typescript'), 'bun remove typescript');
  });

  it('maps dlx/x without the runner prefix', () => {
    assert.equal(resolver('npm x cowsay hi'), 'npx cowsay hi');
    assert.equal(resolver('pnpm dlx cowsay hi'), 'pnpm dlx cowsay hi');
    assert.equal(resolver('bun x cowsay hi'), 'bunx cowsay hi');
  });

  it('maps cache clean', () => {
    assert.equal(resolver('npm cc'), 'npm cache clean --force');
    assert.equal(resolver('pnpm cache-clear'), 'pnpm store prune');
    assert.equal(resolver('bun cc'), 'bun pm cache rm');
  });

  it('forwards flags to npm scripts with "--"', () => {
    assert.equal(resolver('npm run build --watch'), 'npm run build -- --watch');
    assert.equal(resolver('npm run build -- --watch'), 'npm run build -- --watch');
  });

  it('keeps dashes in npm script names', () => {
    assert.equal(resolver('npm run build-all'), 'npm run build-all');
    assert.equal(resolver('npm run build-all --watch'), 'npm run build-all -- --watch');
  });

  it('does not change run for other package managers', () => {
    assert.equal(resolver('yarn run build --watch'), 'yarn run build --watch');
  });
});
