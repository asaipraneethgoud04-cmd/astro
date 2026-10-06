/**
 * Phone number validation and formatting rules for Indian (+91) and US/Canada (+1) numbers,
 * with standard E.164 international fallback support.
 */

export interface PhoneValidationResult {
  isValid: boolean;
  country?: "IN" | "US" | "IN/US" | "INTL";
  formatted?: string;
  error?: string;
}

/**
 * Validates a phone number according to Indian and US/Canada numbering rules.
 * 
 * Rules:
 * - India (+91): 10 digits starting with 6, 7, 8, or 9 (optional prefix +91, 91, or 0).
 * - US/Canada (+1): 10 digits with NANP area code [2-9]\d{2} and exchange code [2-9]\d{2} (optional prefix +1 or 1).
 * - International: E.164 compliant with leading '+' and 8 to 15 digits.
 * 
 * @param input The raw phone number string
 * @param required Whether the phone number is mandatory (default: true)
 */
export function validatePhoneNumber(input: string | null | undefined, required = true): PhoneValidationResult {
  if (!input || !input.trim()) {
    if (!required) {
      return { isValid: true };
    }
    return {
      isValid: false,
      error: "Please enter a phone number we can reach you on.",
    };
  }

  const trimmed = input.trim();
  if (trimmed.length < 7) {
    return {
      isValid: false,
      error: "Phone number is too short. Please enter at least 10 digits.",
    };
  }

  // Strip standard formatting characters (spaces, dashes, parentheses, dots)
  const stripped = trimmed.replace(/[\s\-\(\)\.]/g, "");

  // 1. Explicit Indian Number (+91) or 12 digits starting with 91
  if (stripped.startsWith("+91") || (stripped.startsWith("91") && stripped.length === 12)) {
    const indianMatch = stripped.match(/^(\+?91)([6-9]\d{9})$/);
    if (!indianMatch) {
      return {
        isValid: false,
        error: "Invalid Indian phone number. Mobile numbers must have 10 digits starting with 6, 7, 8, or 9.",
      };
    }
    const core = indianMatch[2];
    return {
      isValid: true,
      country: "IN",
      formatted: `+91 ${core.slice(0, 5)} ${core.slice(5)}`,
    };
  }

  // 2. Explicit US/Canada Number (+1) or 11 digits starting with 1
  if (stripped.startsWith("+1") || (stripped.startsWith("1") && stripped.length === 11)) {
    const usMatch = stripped.match(/^(\+?1)([2-9]\d{2}[2-9]\d{6})$/);
    if (!usMatch) {
      return {
        isValid: false,
        error: "Invalid US phone number. Area code and exchange code cannot begin with 0 or 1.",
      };
    }
    const core = usMatch[2];
    return {
      isValid: true,
      country: "US",
      formatted: `+1 (${core.slice(0, 3)}) ${core.slice(3, 6)}-${core.slice(6)}`,
    };
  }

  // 3. Indian number with leading 0 (e.g. 09876543210)
  if (stripped.startsWith("0") && stripped.length === 11) {
    const indianZero = stripped.match(/^0([6-9]\d{9})$/);
    if (!indianZero) {
      return {
        isValid: false,
        error: "Invalid Indian phone number. 10 digits must begin with 6, 7, 8, or 9.",
      };
    }
    const core = indianZero[1];
    return {
      isValid: true,
      country: "IN",
      formatted: `+91 ${core.slice(0, 5)} ${core.slice(5)}`,
    };
  }

  // 4. Bare 10-digit number (evaluates both India and US rules)
  if (/^\d{10}$/.test(stripped)) {
    const isIndia = /^[6-9]\d{9}$/.test(stripped);
    const isUS = /^[2-9]\d{2}[2-9]\d{6}$/.test(stripped);

    if (isIndia && isUS) {
      return {
        isValid: true,
        country: "IN/US",
        formatted: stripped,
      };
    } else if (isIndia) {
      return {
        isValid: true,
        country: "IN",
        formatted: `+91 ${stripped.slice(0, 5)} ${stripped.slice(5)}`,
      };
    } else if (isUS) {
      return {
        isValid: true,
        country: "US",
        formatted: `+1 (${stripped.slice(0, 3)}) ${stripped.slice(3, 6)}-${stripped.slice(6)}`,
      };
    } else {
      return {
        isValid: false,
        error: "Invalid phone number. Indian numbers must start with 6-9. US numbers cannot have area or exchange codes starting with 0 or 1.",
      };
    }
  }

  // 5. Standard international format with '+' (E.164: 8 to 15 digits)
  if (stripped.startsWith("+") && /^\+[1-9]\d{7,14}$/.test(stripped)) {
    return {
      isValid: true,
      country: "INTL",
      formatted: trimmed,
    };
  }

  return {
    isValid: false,
    error: "Please enter a valid Indian (+91, 10 digits starting with 6-9) or US (+1, 10 digits) phone number.",
  };
}
