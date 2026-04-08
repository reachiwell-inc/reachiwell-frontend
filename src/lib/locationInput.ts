"use client";

// Very small heuristics to decide if an input is a location (postal code / address).
// Keep it simple: we only need to switch socket event names.

export function isPostalCode(text: string): boolean {
  // Canadian format: A1A 1A1 (space optional)
  const postalCodePattern = /^[A-Za-z]\d[A-Za-z]\s?\d[A-Za-z]\d$/;
  return postalCodePattern.test(text.trim());
}

export function isLikelyAddress(text: string): boolean {
  const t = text.trim();
  if (t.length < 8) return false;

  const hasDigit = /\d/.test(t);
  const hasLetter = /[A-Za-z]/.test(t);
  const words = t.split(/\s+/).filter(Boolean);
  const hasEnoughWords = words.length >= 3;
  const startsWithNumber = /^\d+/.test(t);

  const hasAddressHint =
    t.includes(",") ||
    /\b(street|st|road|rd|avenue|ave|boulevard|blvd|drive|dr|lane|ln|close|cl|crescent|cres|way|highway|hwy)\b/i.test(
      t
    );

  // Avoid misclassifying symptom sentences like "I've had a headache for 15 minutes"
  // as an address just because they contain a number.
  // If there's no strong address hint, only treat it as an address when it *starts*
  // with a house/building number (e.g. "10 Downing Street ...").
  return hasDigit && hasLetter && (hasAddressHint || (startsWithNumber && hasEnoughWords));
}

export function isLocationInput(text: string): boolean {
  return isPostalCode(text) || isLikelyAddress(text);
}

