# Package Manager Execute

Dynamically selects NPM or YARN or PNPM to execute commands. NPX is also supported.

## CLI

Runs `npm install` or `yarn install` or `pnpm install` based on your default node package manager.

```shell
pmex install
```

## Scripts

Runs `npm install` or `yarn install` or `pnpm install` based on what you used in the terminal: `yarn start` or `npm start`.

```json
{
  "scripts": {
    "prestart": "pmex install",
    "start": "node server.js"
  }
}
```

## Runtime

Runs commands based on what you used to run the file.

```js
import pmex from 'pmex';

// Different command based on package manager
pmex({
  npm: 'cache clean --force',
  yarn: 'cache clean --all',
  pnpm: 'pnpm store prune'
})

pmex('test')

pmex('npx tsc --noEmit')

pmex('build')
```
