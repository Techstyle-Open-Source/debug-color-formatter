process.browser = true;
const createDebug = require('debug');
const colorFormatter = require('./browser').default;

createDebug.formatters.c = colorFormatter;

const debug = createDebug('debug-color-formatter:browser');
debug.enabled = true;

describe('colorFormatter', () => {
  beforeEach(() => {
    jest.spyOn(console, 'log');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('does nothing in browser mode', () => {
    debug('test %cfoo bar%c', 'color: red', '');
    expect(console.log).toHaveBeenCalledWith(
      '%cdebug-color-formatter:browser %ctest %cfoo bar%c%c +0ms',
      expect.stringMatching(/color: #[0-9a-f]{6}/i),
      'color: inherit',
      'color: red',
      '',
      expect.stringMatching(/color: #[0-9a-f]{6}/i)
    );
  });
});
