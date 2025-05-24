import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface ParsedClerkUsername {
  parsedFullName: string | null;
  extractedId: string | null;
}

/**
 * Parses a Clerk username string to extract a full name and an ID.
 * Assumes the format "FullName_ID" where ID is the part after the last underscore.
 * @param username The Clerk username string.
 * @returns An object containing parsedFullName and extractedId.
 */
export function parseClerkUsername(username: string | null | undefined): ParsedClerkUsername {
  if (!username) {
    return { parsedFullName: null, extractedId: null };
  }

  const lastUnderscoreIndex = username.lastIndexOf('_');

  if (lastUnderscoreIndex === -1 || lastUnderscoreIndex === 0 || lastUnderscoreIndex === username.length - 1) {
    // No underscore, or it's at the beginning/end, so no valid ID to extract.
    // Treat the whole username as the full name in this case.
    return { parsedFullName: username, extractedId: null };
  }

  const parsedFullName = username.substring(0, lastUnderscoreIndex);
  const extractedId = username.substring(lastUnderscoreIndex + 1);

  return { parsedFullName, extractedId };
}
