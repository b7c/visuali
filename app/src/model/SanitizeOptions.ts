export interface HtmlSanitizeOptions {
  quotes: boolean,
  singleQuotes: boolean,
  angleBrackets: boolean,
  ampersand: boolean,
}

export interface StringSanitizeOptions {
  quotes: boolean,
  singleQuotes: boolean,
  backslash: boolean,
  slash: boolean,
}

export interface SanitizeOptions {
  html: HtmlSanitizeOptions,
  string: StringSanitizeOptions,
}