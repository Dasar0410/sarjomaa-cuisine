import { type ReactNode, createElement } from "react"

function isIngredientMatch(word: string, ingredientNames: string[]): boolean {
  const lower = word.toLowerCase();
  return ingredientNames.some(name => lower.includes(name) || name.includes(lower));
}

export function highlightIngredients(text: string, ingredientNames: string[]): ReactNode {
  if (ingredientNames.length === 0) return text;

  const normalizedNames = ingredientNames.map(name => name.trim().toLowerCase());
  const tokens = text.split(/(\s+)/);

  return tokens.map((token, i) => {
    if (/^\s+$/.test(token)) return token;

    const match = token.match(/^(.+?)([.,;:!?]*)$/);
    const word = match ? match[1] : token;
    const punctuation = match ? match[2] : '';

    if (word.length >= 3 && isIngredientMatch(word, normalizedNames)) {
      return createElement('span', { key: i },
        createElement('span', { className: 'font-bold text-brand-primary' }, word),
        punctuation
      );
    }
    return token;
  });
}
