export type Args = Omit<{ [key: string]: string | number | boolean }, '_' | '$'> & {
  _: string[];
  $: string;
};

export type ArgsOptions = {
  case?: 'camel' | 'pascal' | 'snake' | 'kebab' | null;
};

export default function args(defaults?: Record<string, string | number | boolean>, options?: ArgsOptions) {
  const argv = process.argv?.slice(2) ?? [];

  // @ts-expect-error
  const result: Args = {
    $: '',
    _: [],
  };

  if (defaults) {
    argv.unshift(
      ...Object.entries(defaults)
        .map(([attr, value]) => [`--${attr}`, `${value}`])
        .flat(),
    );

    for (const attr in defaults) {
      if (attr in result) {
        continue;
      }

      result[attr] = defaults[attr];
    }
  }

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    const next = argv[i + 1];

    if (!arg.startsWith('-')) {
      result._.push(arg);
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

      const isExplicitVal = ['string', 'number'].includes(typeof value);
      const prefix = isExplicitVal || attr.length > 1 ? '--' : '-';
      const finalValue = typeof value === 'string' && /\s/.test(value) ? `"${value}"` : value;
      result.$ += `${prefix}${attr}${isExplicitVal ? `=${finalValue}` : ''} `;

      // Parse case
      switch (options?.case) {
        case 'camel':
          attr = attr
            .replace(/^([a-zA-Z])/, (_, $1) => $1.toLowerCase())
            .replace(/([^a-zA-Z])([a-zA-Z])/g, (_, $1, $2) => $2.toUpperCase());
          break;
        case 'pascal':
          attr = attr
            .replace(/^([a-zA-Z])/, (_, $1) => $1.toUpperCase())
            .replace(/([^a-zA-Z])([a-zA-Z])/g, (_, $1, $2) => $2.toUpperCase());
          break;
        case 'snake':
          attr = attr
            .replace(/([a-z])([A-Z])/g, '$1-$2')
            .toLowerCase()
            .replace(/([^a-z_])/g, '_')
            .replace(/^_/, '')
            .replace(/_$/, '');
          break;
        case 'kebab':
          attr = attr
            .replace(/([a-z])([A-Z])/g, '$1-$2')
            .toLowerCase()
            .replace(/([^a-z\-])/g, '-')
            .replace(/^-/, '')
            .replace(/-$/, '');
          break;
      }

      result[attr] = value;
    }
  }

  result.$ = `${result._.join(' ')} ${result.$.trim()}`.trim();

  return result;
}
