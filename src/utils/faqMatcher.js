/**
 * FAQ matching logic.
 * Tokenizes the user question and scores keyword overlap against each FAQ,
 * ignoring very common words so a single generic word can't force a false match.
 */

// Common words that shouldn't count toward a match on their own
const STOP_WORDS = new Set([
  'the','and','you','are','for','can','with','what','when','where','how','why',
  'your','our','out','does','did','has','have','was','were','will','would','could',
  'this','that','they','them','from','into','about','any','all','get','got','put',
  'not','but','yes','need','want','like','make','made','give','take','here','there'
]);

function tokenize(text) {
  return text.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(token => token.length > 2 && !STOP_WORDS.has(token));
}

function matchFaq(userQuestion, faqs) {
  if (!faqs || faqs.length === 0) return null;
  const userTokens = tokenize(userQuestion);
  if (userTokens.length === 0) return null;

  let bestMatch = null;
  let highestScore = 0;

  for (const faq of faqs) {
    const faqTokens = tokenize(faq.question);
    // Count meaningful words the question and this FAQ share
    const overlap = userTokens.filter(token => faqTokens.includes(token));
    const score = overlap.length;
    if (score > highestScore) {
      highestScore = score;
      bestMatch = faq;
    }
  }

  // Require at least one MEANINGFUL shared word (stop words already removed).
  // If nothing meaningful matched, return null so the bot offers the lead form
  // instead of guessing the nearest weak match.
  return highestScore >= 1 ? bestMatch : null;
}

module.exports = { matchFaq };
