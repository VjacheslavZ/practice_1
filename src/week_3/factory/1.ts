const COLORS = {
  warning: '\x1b[1;33m',
  error: '\x1b[0;31m',
  info: '\x1b[1;37m',
} as const;

type LoggerOptions =
  | { level: keyof typeof COLORS }
  | { color: (typeof COLORS)[keyof typeof COLORS] };
type TLogger = (options: LoggerOptions) => (message: string) => void;

const logger: TLogger = options => message => {
  const color = 'color' in options ? options.color : COLORS[options.level];
  const date = new Date().toISOString();
  console.log(`${color}${date}\t${message}`);
};

const warning = logger({ level: 'warning' });
warning('Hello warning');

const error = logger({ color: '\x1b[1;37m' });
error('Hello error');
