# Package Manager Execute

Dynamically selects NPM or YARN or PNPM or BUN to execute commands. NPX is also supported.

## API

```shell
pmex [...command]
```

## Examples

### CLI
This example runs  `npm install` or `yarn install` or `pnpm install` or `bun install` based on how you run the command.

```shell
pmex install // uses OS default's package manager (probably npm)
pmex npm install
pmex yarn install
pmex pnpm install
pmex bun install
```

### Scripts

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
  bun: 'bun pm cache rm -g'
})

// Fallback defaults
pmex({
  bun: 'bunx cowsay "Hello World!"',
  default: 'npx cowsay "Hello World!"'
})

pmex('test')

pmex('npx tsc --noEmit')

pmex('build')
```

### Override

You can force the use of a package manager. This example runs `npm install` for all package managers and then runs `tsc` with automatic detection of the package manager.

```js
import pmex from 'pmex';

pmex('npm install -g tsc')

pmex('tsc --noEmit')
```
