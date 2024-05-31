export default function resolver(command: string) {
  let [runner, fnName, ...params] = command.split(' ');

  // @ts-expect-error
  const newFnName = aliases[fnName]?.[runner] ?? fnName;
  command = `${newFnName} ${params.join(' ')}`;

  if (runner === 'npm' && newFnName === 'run') {
    command = command.replace(/-/, '-- -');
  }

  if (fnName !== 'dlx') {
    command = `${runner} ${command}`;
  }

  return command.trim();
}

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
  yarn: 'yarn dlx',
  pnpm: 'pnpm dlx',
  bun: 'bunx',
};

const aliases = {
  add,
  remove: del,
  uninstall: del,
  del,
  dlx,
  x: dlx,
};
