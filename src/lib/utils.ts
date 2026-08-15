import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generates a random string of the specified length.
 * The string is composed of uppercase and lowercase letters, and numbers.
 *
 * @param {number} length - The length of the string to generate.
 * @returns {string} A random string of the specified length.
 */
export function generateRandomString(length: number): string {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    // Select a random character from the string of characters
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

/**
 * Generates a random booking code of the specified length.
 * The booking code is composed of uppercase letters and numbers.
 *
 * @returns {string} A random booking code of the specified length.
 */
export function generateBookingCode(): string {
  /**
   * The characters to use when generating the booking code.
   * This includes uppercase letters (A-Z) and numbers (0-9).
   */
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  /**
   * The length of the booking code to generate.
   * This is set to 8, which should be sufficient for most use cases.
   */
  const length = 8;
  for (let i = 0; i < length; i++) {
    /**
     * Select a random character from the string of characters.
     * This is done by generating a random number between 0 and the length of the characters string,
     * and then using that number as the index to get the character at that position in the string.
     */
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

/**
 * Converts a string to title case, by capitalizing the first letter of each word.
 *
 * @param {string} str - The string to convert to title case.
 * @returns {string} The string in title case.
 */
export function toTitleCase(str: string): string {
  const lowerCaseString = str.toLocaleLowerCase();
  const words = lowerCaseString.split(" ");
  const capitalizedWords = words.map((word) => {
    if (!word) return word;
    // Capitalize the first letter of the word
    return `${word[0].toUpperCase()}${word.slice(1)}`;
  });
  // Join the words back together with spaces
  return capitalizedWords.join(" ");
}

/**
 * Formats a given date or datetime string into a human-readable string.
 * If the date is invalid, returns the string "Invalid Date".
 *
 * @param {Date|string|number} date - The date or datetime string to format.
 * @returns {string} A human-readable string representing the date.
 */
export function formatDateTime(date: Date | string | number): string {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h24",
  };

  const dateToFormat = date instanceof Date ? date : new Date(date);

  if (Number.isNaN(dateToFormat.getTime())) {
    // Handle invalid date inputs
    return "Invalid Date";
  }

  // Format the date using the Internationalization API
  return new Intl.DateTimeFormat("fr-CM", options).format(dateToFormat);
}

/**
 * Formats a date range from two given dates into a human-readable string.
 * If the dates represent the same day, the format is:
 *   DD MMM YYYY HH:MM - HH:MM
 * Otherwise, the format is:
 *   DD MMM YYYY HH:MM - DD MMM YYYY HH:MM
 *
 * @param {Date} from - The start date of the range.
 * @param {Date} to - The end date of the range.
 * @returns {string} A human-readable string representing the date range.
 */
export function formatDateRange(from: Date, to: Date): string {
  const isSameDay =
    from.getDate() === to.getDate() &&
    from.getMonth() === to.getMonth() &&
    from.getFullYear() === to.getFullYear();

  if (isSameDay) {
    // Format the date string
    const dateStr = from.toLocaleString("fr-CM", {
      day: "numeric",
      month: "short",
    });
    // Format the time strings
    const fromTime = from
      .toLocaleString("fr-CM", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
      .toLowerCase();
    const toTime = to
      .toLocaleString("fr-CM", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
      .toLowerCase();
    // Return the formatted string
    return `${dateStr} ${fromTime} - ${toTime}`;
  } else {
    // Format the from date string
    const fromStr = from
      .toLocaleString("fr-CM", {
        day: "numeric",
        month: "short",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
      .toLowerCase();
    // Format the to date string
    const toStr = to
      .toLocaleString("fr-CM", {
        day: "numeric",
        month: "short",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
      .toLowerCase();
    // Return the formatted string
    return `${fromStr} - ${toStr}`;
  }
}

/**
 * Formats a given number as currency in Nigerian Naira (NGN).
 *
 * @param {number} data - The number to format as currency.
 * @returns {string} A string representing the formatted currency in NGN.
 */
export function formatCurrency(data: number): string {
  // Format the number as currency using the Internationalization API
  return Intl.NumberFormat("fr-CM", {
    style: "currency",
    currency: "XAF",
    currencyDisplay: "narrowSymbol",
  }).format(data);
}

/**
 * A higher-order function that takes a function and a delay as arguments and
 * returns a debounced version of the function.
 *
 * A debounced function is a function that is only called once the user has
 * stopped calling it for a certain amount of time (the delay). This is useful
 * for things like search inputs where you don't want to call the server on
 * every single key press.
 *
 * @param {function} fn - The function to debounce.
 * @param {number} delay - The delay in milliseconds.
 * @returns {function} A debounced version of the function.
 */
export function debounce<T extends (...args: unknown[]) => void>(
  fn: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>; // Holds the timeout ID for the debounce delay

  // Returns a function that clears the existing timeout and sets a new one
  return (...args: Parameters<T>) => {
    clearTimeout(timer); // Clear the previous timeout
    // Set a new timeout with the specified delay, calling the original function with the provided arguments
    timer = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Escapes special characters for MarkdownV2.
 *
 * @param {string} text - The text string to escape.
 * @returns {string} The escaped text string.
 */
export function escapeMarkdown(text: string): string {
  // Escape special characters for MarkdownV2, using a regular expression
  // to replace each special character with its escaped version
  return text.replaceAll(/([_*[\]()~`>#+\-=|{}.!])/g, String.raw`\$1`);
}
