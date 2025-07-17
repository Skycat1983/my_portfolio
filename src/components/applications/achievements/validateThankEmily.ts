export interface ThankEmilyValidation {
  score: number; // 0-100 percentage
  maxScore: number; // Always 100
  errors: string[];
  suggestions: string[];
  isComplete: boolean;
}

// Validation function for Thank Emily message
export const validateThankEmilyMessage = (
  message: string
): ThankEmilyValidation => {
  // Always create fresh arrays to ensure no persistence between calls
  const errors: string[] = [];
  const suggestions: string[] = [];
  let score = 100;
  const maxScore = 100;
  const trimmedMessage = message.trim();

  // === CORE REQUIREMENTS (deduct 10 points for each error) ===

  // 1. Check for thanks/thank you
  const hasThanks = /\b(thanks|thank you)\b/i.test(trimmedMessage);
  const hasIncorrectThankyou = /\bthankyou\b/i.test(trimmedMessage);

  if (hasIncorrectThankyou) {
    score -= 10;
    errors.push("'thankyou' is two words, not one");
    suggestions.push("Use 'thank you' instead of 'thankyou'");
  } else if (!hasThanks) {
    score -= 10;
    errors.push(
      "You can't express gratitude without a 'thanks' or a 'thank you'"
    );
    suggestions.push("Add 'thanks' or 'thank you' to your message");
  }

  // 2. Check capitalization at start
  const startsWithCapital = /^[A-Z]/.test(trimmedMessage);
  if (!startsWithCapital) {
    score -= 10;
    errors.push("Sentences start with a capital letter...");
    suggestions.push("Capitalize the first letter of your message");
  }

  // 3. Check ends with full stop
  const endsWithPeriod = /\.$/.test(trimmedMessage);
  if (!endsWithPeriod) {
    score -= 10;
    errors.push("A properly formatted message ends with a full stop.");
    suggestions.push("Add a full stop at the end of your message");
  }

  const doesNotContainHerName =
    !/\bemily\b/i.test(trimmedMessage) || !/\bEmily\b/i.test(trimmedMessage);
  if (doesNotContainHerName) {
    score -= 10;
    errors.push("You aren't even going to mention her name?");
    suggestions.push("Add Emily's name to your message");
  }

  // 4. Check Emily capitalization (if Emily is mentioned)
  const hasIncorrectEmily = /\bemily\b/.test(trimmedMessage);

  if (hasIncorrectEmily) {
    score -= 10;
    errors.push(
      "Emily helped me a lot here. You should at least capitalize her name."
    );
    suggestions.push("Write 'Emily' with a capital 'E'");
  }

  // 5. Check for helping context
  const hasGoodGrammar =
    /\b(help(ing|ed)?|assist(ing|ed|ance)?|support(ing|ed)?)\b/i.test(
      trimmedMessage
    );
  if (!hasGoodGrammar) {
    score -= 10;
    errors.push("Message should mention how Emily helped you");
    suggestions.push("Add details about how Emily helped you");
  }

  // === ADDITIONAL GRAMMAR CHECKS (Optional - easily removable) ===

  // Grammar Check A: Comma after direct address
  const hasThankYouEmily = /\bthank you emily\b/i.test(trimmedMessage);
  if (hasThankYouEmily) {
    score -= 10;
    errors.push(
      "When addressing someone directly, use a comma: 'Thank you, Emily'"
    );
    suggestions.push(
      "Add a comma before Emily's name when thanking her directly"
    );
  }

  // Grammar Check B: Double spacing (easily removable)
  const hasDoubleSpaces = /\s{2,}/.test(trimmedMessage);
  if (hasDoubleSpaces) {
    score -= 10;
    errors.push(
      "Avoid multiple consecutive spaces. It shows laziness and poor attention to detail."
    );
    suggestions.push("Use single spaces between words");
  }

  // Grammar Check C: Common contractions (easily removable)
  const hasInformalContractions = /\b(ur|u|thx|thnx)\b/i.test(trimmedMessage);
  if (hasInformalContractions) {
    score -= 10;
    errors.push("Use formal language instead of text abbreviations");
    suggestions.push("Write out full words like 'you' and 'thank you'");
  }

  // Grammar Check D: Repetitive words (easily removable)
  const words = trimmedMessage.toLowerCase().split(/\s+/);
  const wordCounts = words.reduce((acc, word) => {
    const cleanWord = word.replace(/[^\w]/g, "");
    acc[cleanWord] = (acc[cleanWord] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const repeatedWords = Object.entries(wordCounts)
    .filter(([word, count]) => count > 2 && word.length > 2)
    .map(([word]) => word);

  if (repeatedWords.length > 0) {
    score -= 10;
    errors.push(`Avoid repeating words too often: ${repeatedWords.join(", ")}`);
    suggestions.push(
      "Use varied vocabulary to make your message more engaging"
    );
  }

  // Ensure score doesn't go below 0
  score = Math.max(0, score);

  // Achievement only unlocks with perfect score AND no errors
  const isComplete = score === 100 && errors.length === 0;

  return {
    score,
    maxScore,
    errors: [...errors], // Spread to ensure fresh array
    suggestions: [...suggestions], // Spread to ensure fresh array
    isComplete,
  };
};
