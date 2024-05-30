export type Args = Omit<{ [key: string]: string | number | boolean }, '_' | '$'> & {
  _: string[];
  $: string;
};

export type ArgsOptions = {
  case?: 'camel' | 'pascal' | 'snake' | 'kebab' | null;
  aliases?: Record<string, string>;
};

export default function args(defaults?: Record<string, string | number | boolean>, options?: ArgsOptions) {
  const argv = process.argv?.slice(2) ?? [];

  const { case: caseStyle, aliases = {} } = options || {};

  // @ts-expect-error
  const result: Args = {
    $: '',
    _: [],
  };

  if (defaults) {
    for (let attr in defaults) {
      const finalAttr = aliases[attr] ?? attr;
      result[finalAttr] = defaults[attr];
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

      // Parse case
      switch (caseStyle) {
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

      attr = aliases[attr] ?? attr;
      result[attr] = value;
    }
  }

  for (const attr in result) {
    if (attr === '_' || attr === '$') continue;

    const value = `${result[attr]}`;
    const isExplicitVal = value !== 'true';
    const prefix = isExplicitVal || attr.length > 1 ? '--' : '-';
    const finalValue = /\s/.test(value) ? `"${value}"` : value;
    result.$ += `${prefix}${attr}${isExplicitVal ? `=${finalValue}` : ''} `;
  }

  result.$ = `${result._.join(' ')} ${result.$.trim()}`.trim();

  return result;
}
