import createDebug from 'debug';
import colorFormatter from './src';

createDebug.formatters.c = colorFormatter;

const debug = createDebug('demo');
debug.enabled = true;

debug(
  'Fancy mode is disabled, set %coptions.fancy.enabled%c to change.',
  'color: cyan',
  ''
);
debug(
  '%c!%c 429 Too Many Requests. The request will be retried.',
  'color: red',
  ''
);
debug(
  '%cWARNING%c This feature will be deprecated in the next release.',
  'font-weight: bold; background-color: #ffcf00; color: black',
  ''
);
debug(
  '%cUnderlined text!%c Still bold here.%c',
  'font-weight: bold; text-decoration: underline',
  'text-decoration: none',
  ''
);
debug(
  'It’s a %cr%ca%ci%cn%cb%co%cw%c!',
  'color: red',
  'color: orange',
  'color: yellow',
  'color: green',
  'color: blue',
  'color: purple',
  'color: magenta',
  ''
);
