/**
 * Indian State Drug License (DL) Number Validator
 * Validates wholesale (Form 20B/21B) and retail (Form 20/21) license formats
 * across Indian states (e.g. DL-RAJ-2024-55891, 20B/MH-12345, GJ/20B/12345).
 */

const STATE_CODES = [
  "AP", "AR", "AS", "BR", "CG", "CH", "DD", "DL", "DN", "GA", "GJ", "HP", "HR",
  "JH", "JK", "KA", "KL", "LA", "LD", "MH", "ML", "MN", "MP", "MZ", "NL", "OD",
  "PB", "PY", "RJ", "SK", "TN", "TR", "TS", "UK", "UP", "WB", "RAJ", "DEL", "MAH"
];

export interface IDlValidationResult {
  isValid: boolean;
  normalized: string;
  error?: string | undefined;
  detectedState?: string | undefined;
  formType?: string | undefined;
}

export const validateDrugLicenseNumber = (
  rawDlNumber: string,
  stateHint?: string
): IDlValidationResult => {
  if (!rawDlNumber || typeof rawDlNumber !== "string") {
    return {
      isValid: false,
      normalized: "",
      error: "Drug License Number is required",
    };
  }

  const trimmed = rawDlNumber.trim().toUpperCase();

  // Basic length check (Indian DL numbers range between 6 and 40 characters)
  if (trimmed.length < 6 || trimmed.length > 40) {
    return {
      isValid: false,
      normalized: trimmed,
      error: "Drug License Number must be between 6 and 40 characters",
    };
  }

  // Allowed characters: letters, digits, hyphen, slash, space, dot, ampersand (for 20B & 21B combo)
  const allowedCharsRegex = /^[A-Z0-9\s/.\-&]+$/;
  if (!allowedCharsRegex.test(trimmed)) {
    return {
      isValid: false,
      normalized: trimmed,
      error: "Drug License Number contains invalid characters. Use letters, numbers, hyphens, and slashes.",
    };
  }

  // Detect Form Type (20B, 21B, 20, 21, WDL, RDL)
  let formType = "General License";
  if (/20B|21B/i.test(trimmed)) {
    formType = "Wholesale Allopathic / Biological (Form 20B/21B)";
  } else if (/20|21/i.test(trimmed)) {
    formType = "Retail License (Form 20/21)";
  }

  // Detect State Code Prefix
  let detectedState: string | undefined;
  for (const code of STATE_CODES) {
    const stateRegex = new RegExp(`(^|[-/\\s])${code}([-/\\s]|$)`, "i");
    if (stateRegex.test(trimmed)) {
      detectedState = code;
      break;
    }
  }

  // Verify that it contains at least 3 digits (all genuine licenses have registration numbers)
  const digitCount = (trimmed.match(/\d/g) || []).length;
  if (digitCount < 3) {
    return {
      isValid: false,
      normalized: trimmed,
      error: "Drug License Number must contain valid registration digits (minimum 3 numbers)",
    };
  }

  return {
    isValid: true,
    normalized: trimmed,
    detectedState,
    formType,
  };
};

export default validateDrugLicenseNumber;
