import ansiStyles from 'ansi-styles';
import colorString from 'color-string';

// CSS color name -> [foreground, background] (properties from `ansi-styles`).
const termColors = new Map([
  ['black', ['black', 'bgBlack']],
  ['red', ['red', 'bgRed']],
  ['green', ['green', 'bgGreen']],
  ['yellow', ['yellow', 'bgYellow']],
  ['blue', ['blue', 'bgBlue']],
  ['magenta', ['magenta', 'bgMagenta']],
  ['cyan', ['cyan', 'bgCyan']],
  ['white', ['white', 'bgWhite']],
  ['gray', ['gray', 'bgGray']]
]);
// Some CSS colors have multiple names.
termColors.set('aqua', termColors.get('cyan'));
termColors.set('fuchsia', termColors.get('magenta'));
termColors.set('grey', termColors.get('gray'));

// CSS rule parser for only basic syntax. This will break if there are property
// values with `;` in them, for example (say, the `content` property or a
// `url(...)` value).
export function parseCssRules(rules) {
  return rules
    .split(/;+/g)
    .map(rule => {
      const match = rule.match(/\s*([\w-]+)\s*:\s*([^;]+)\s*/);
      if (match) {
        const property = match[1];
        const value = match[2];
        return [property, value];
      }
    })
    .filter(Boolean);
}

export function cssToAnsi(rules) {
  let output = '';

  rules.forEach(([property, value]) => {
    switch (property) {
      case 'color': {
        if (value === 'inherit') {
          output += ansiStyles.color.close;
        } else if (termColors.has(value)) {
          const color = termColors.get(value)[0];
          output += ansiStyles[color].open;
        } else {
          const color = colorString.get(value);
          if (color) {
            output += ansiStyles.color.ansi256[color.model](...color.value);
          }
        }
        break;
      }
      case 'background':
      case 'background-color': {
        if (
          value === 'inherit' ||
          value === 'none' ||
          value === 'transparent'
        ) {
          output += ansiStyles.bgColor.close;
        }
        if (termColors.has(value)) {
          const bgColor = termColors.get(value)[1];
          output += ansiStyles[bgColor].open;
        }
        const color = colorString.get(value);
        if (color) {
          output += ansiStyles.bgColor.ansi256[color.model](...color.value);
        }
        break;
      }
      case 'font-weight':
        switch (value) {
          case '700':
          case '800':
          case '900':
          case 'bold':
            output += ansiStyles.bold.open;
            break;
          case '100':
          case '200':
          case '300':
          case '400':
          case '500':
          case '600':
          case 'normal':
          case 'inherit':
            output += ansiStyles.bold.close;
            break;
        }
        break;
      case 'font-style':
        switch (value) {
          case 'italic':
            output += ansiStyles.italic.open;
            break;
          case 'normal':
          case 'inherit':
            output += ansiStyles.italic.close;
            break;
        }
        break;
      case 'text-decoration':
        switch (value) {
          case 'underline':
            output += ansiStyles.underline.open;
            break;
          case 'line-through':
            output += ansiStyles.strikethrough.open;
            break;
          case 'none':
          case 'inherit':
            output += ansiStyles.underline.close;
            output += ansiStyles.strikethrough.close;
            break;
        }
        break;
    }
  });

  return output;
}

export default function colorFormatter(value) {
  // `this` will be the specific logger instance.
  if (!this.useColors) {
    return '';
  }
  if (!value) {
    return ansiStyles.reset.open;
  }

  const rules = parseCssRules(value);
  return cssToAnsi(rules);
}
