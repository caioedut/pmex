# Node Command Execute

Dynamically selects YARN or NPM to execute commands. NPX is also supported.

## CLI

Runs `yarn install` or `npm install` based on your default node package manager.

```shell
ncx install
```

## package.json

Runs `yarn install` or `npm install` based on what you used in the terminal: `yarn start` or `npm start`.

```json
{
  "scripts": {
    "prestart": "ncx install",
    "start": "node server.js"
  }
}
```

## Runtime

Runs (`yarn test` + `yarn build`) or (`npm test` + `npm build`) based on what you used to run the file.

```js
import ncx from 'ncx';

ncx('test')
ncx('build')
```

### NPX

You can run it with NPX.

```js
import ncx from 'ncx';

ncx('npx tsc')
```
