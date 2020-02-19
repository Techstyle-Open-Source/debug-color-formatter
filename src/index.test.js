import createDebug from 'debug';
import colorFormatter, { parseCssRules } from './index';

createDebug.formatters.c = colorFormatter;

const debug = createDebug('debug-color-formatter:index');
debug.enabled = true;

describe('colorFormatter', () => {
  it('adds support for %c to debug', () => {
    debug('test %cbold%c', 'font-weight: bold', '');
    debug('test %citalic%c', 'font-style: italic', '');
    debug('test %cunderline%c', 'text-decoration: underline', '');
    debug('test %ccolor%c', 'color: cyan', '');
    debug(
      'test %cr%ca%ci%cn%cb%co%cw%c',
      'color: red',
      'color: orange',
      'color: yellow',
      'color: green',
      'color: blue',
      'color: purple',
      'color: magenta',
      ''
    );
    debug('test %cbackground%c', 'background-color: red; color: white', '');
    debug(
      'test %crgb() colors%c',
      'background-color: rgb(44, 9, 143); color: white',
      ''
    );
    debug('test %c#hex colors%c', 'background-color: #b3fe14; color:black', '');
  });
});

describe('parseCssRules', () => {
  it('parses single rules', () => {
    expect(parseCssRules('color: red')).toEqual([['color', 'red']]);
    expect(parseCssRules('color: red;')).toEqual([['color', 'red']]);
    expect(parseCssRules('color:red;')).toEqual([['color', 'red']]);
    expect(parseCssRules('background-color: red')).toEqual([
      ['background-color', 'red']
    ]);
    expect(parseCssRules('background-color: #ff0000')).toEqual([
      ['background-color', '#ff0000']
    ]);
  });

  it('parses multiple rules', () => {
    expect(parseCssRules('color: red; font-weight: bold')).toEqual([
      ['color', 'red'],
      ['font-weight', 'bold']
    ]);
    expect(parseCssRules('color: red; color: blue')).toEqual([
      ['color', 'red'],
      ['color', 'blue']
    ]);
    expect(
      parseCssRules('font-style: italic; text-decoration: underline')
    ).toEqual([
      ['font-style', 'italic'],
      ['text-decoration', 'underline']
    ]);
  });
});
