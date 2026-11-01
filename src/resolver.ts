export default function resolver(command: string) {
  const [runner, fnName, ...params] = command.split(' ');

  // @ts-expect-error
  const newFnName = aliases[fnName]?.[runner] ?? fnName;

  // npm requires "--" to forward flags to the script (params[0] is the script name)
  if (runner === 'npm' && newFnName === 'run') {
    const firstFlag = params.findIndex((param, index) => index > 0 && param.startsWith('-'));

    if (firstFlag > 0 && params[firstFlag] !== '--') {
      params.splice(firstFlag, 0, '--');
    }
  }

  let newCommand = `${newFnName} ${params.join(' ')}`;

  if (fnName !== 'x' && fnName !== 'dlx') {
    newCommand = `${runner} ${newCommand}`;
  }

  return newCommand.trim();
}

const isYarnLegacy = process?.env?.npm_config_user_agent?.match(/^yarn\/(\S+)/)?.[1]?.startsWith('1.');

const add = {
  npm: 'install',
  yarn: 'add',
  pnpm: 'add',
  bun: 'add',
};

const del = {
  npm: 'uninstall',
  yarn: 'remove',
  pnpm: 'remove',
  bun: 'remove',
};

const dlx = {
  npm: 'npx',
  yarn: isYarnLegacy ? 'npx' : 'yarn dlx',
  pnpm: 'pnpm dlx',
  bun: 'bunx',
};

const cc = {
  npm: 'cache clean --force',
  yarn: 'cache clean --all',
  pnpm: 'store prune',
  bun: 'pm cache rm',
};

const aliases = {
  add,
  remove: del,
  uninstall: del,
  del,
  dlx,
  x: dlx,
  cc,
  'cache-clean': cc,
  'cache-clear': cc,
};
