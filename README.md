# Package Manager Execute

Dynamically selects NPM or YARN or PNPM or BUN to execute commands.

```shell
pmex [...command]
```

## CLI

### Auto Selection
Runs  `npm install` or `yarn install` or `pnpm install` or `bun install` based on most recent LOCKFILE.

```shell
pmex install
```

## Defined Commands

### `add`

Add packages to the project.

```bash
pmex add typescript

# npm install typescript
# yarn add typescript
# pnpm add typescript
# bun add typescript
```

### `del`

Remove packages from project.

Aliases: `remove`, `uninstall`.

```bash
pmex del typescript

# npm uninstall typescript
# yarn remove typescript
# pnpm remove typescript
# bun remove typescript
```

### `x`

Aliases: `dlx`.

Auto-install (no save) and run packages from NPM.

```bash
pmex x cowsay "Hello World!"

# npx cowsay "Hello World!"
# yarn dlx cowsay "Hello World!"
# pnpm dlx cowsay "Hello World!"
# bunx cowsay "Hello World!"
```

### `cc`

Aliases: `cache-clean`, `cache-clear`.

Clear the package manager cache.

```bash
pmex cc

# npm cache clean --force
# yarn cache clean --all
# pnpm store prune
# bun pm cache rm
```

## Scripting

This example runs `npm install` or `yarn install` or `pnpm install` or `bun install` based on what you used in the terminal: `yarn start` or `npm start` or `pnpm start`  or `bun start`.

```json
{
  "scripts": {
    "prestart": "pmex install",
    "start": "node server.js"
  }
}
```

### Runtime

This example runs commands based on what you used to run the file.

```js
import pmex from 'pmex';

// Different command based on package manager
pmex({
  npm: 'cache clean --force',
  yarn: 'cache clean --all',
  pnpm: 'store prune',
  bun: 'pm cache rm -g'
})

// Fallback to default
pmex({
  bun: 'bunx cowsay "Hello World!"',
  default: 'npx cowsay "Hello World!"'
})

pmex('test')

pmex('tsc --noEmit')

pmex('build')
```

### Override

You can force the use of a package manager. This example runs `npm install` for all package managers and then runs `tsc` with automatic detection of the package manager.

```js
import pmex from 'pmex';

pmex('npm install -g tsc')

pmex('tsc --noEmit')
```

