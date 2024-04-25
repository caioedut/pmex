export type Args = Omit<{ [key: string]: string | number | boolean }, '_args' | '_raw'> & {
  _raw: string;
  _args: string[];
};

export default function args() {
  const argv = process.argv?.slice(2) ?? [];

  // @ts-expect-error
  const result: Args = {
    _raw: argv.join(' '),
    _args: [],
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    const next = argv[i + 1];

    if (!arg.startsWith('-')) {
      result._args.push(arg);
      continue;
    }

    if (arg.startsWith('-')) {
      const split = arg.split('=');

      let attr: string = split.shift()!.replace(/^-{1,2}/g, '');
      let value: string | number | boolean = split.join('=');

      if (!split.length && typeof next === 'string' && !next.startsWith('-')) {
        value = next;
        i++;
      }

      if (value === '' || value === 'true') {
        value = true;
      }

      if (value === 'false') {
        value = false;
      }

      // @ts-expect-error
      if (typeof value === 'string' && !isNaN(value) && !isNaN(parseFloat(value))) {
        value = parseFloat(value);
      }

      result[attr] = value;
    }
  }

  return result;
}
