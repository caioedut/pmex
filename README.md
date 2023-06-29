# Package Manager Execute

Dynamically selects YARN or NPM to execute commands. NPX is also supported.

## CLI

Runs `yarn install` or `npm install` based on your default node package manager.

```shell
pmex install
```

## package.json

Runs `yarn install` or `npm install` based on what you used in the terminal: `yarn start` or `npm start`.

```json
{
  "scripts": {
    "prestart": "pmex install",
    "start": "node server.js"
  }
}
```

## Runtime

Runs (`yarn test` + `yarn build`) or (`npm test` + `npm build`) based on what you used to run the file.

```js
import pmex from 'pmex';

pmex('test')
pmex('build')
```

### NPX

You can run it with NPX.

```js
import pmex from 'pmex';

pmex('npx tsc')
```
