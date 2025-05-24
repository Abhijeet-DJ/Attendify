import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface ParsedNameAndId {
  parsedName: string | null;
  extractedId: string | null;
}

/**
 * Parses a string (expected to be like "FullName_ID") to extract a full name and an ID.
 * ID is the part after the last underscore.
 * @param inputString The string to parse.
 * @returns An object containing parsedName and extractedId.
 */
export function parseNameAndIdFromString(inputString: string | null | undefined): ParsedNameAndId {
  if (!inputString) {
    return { parsedName: null, extractedId: null };
  }

  const lastUnderscoreIndex = inputString.lastIndexOf('_');

  if (lastUnderscoreIndex === -1 || lastUnderscoreIndex === 0 || lastUnderscoreIndex === inputString.length - 1) {
    // No underscore, or it's at the beginning/end, so no valid ID to extract.
    // Treat the whole string as the name in this case.
    return { parsedName: inputString, extractedId: null };
  }

  const parsedName = inputString.substring(0, lastUnderscoreIndex);
  const extractedId = inputString.substring(lastUnderscoreIndex + 1);

  return { parsedName, extractedId };
}
