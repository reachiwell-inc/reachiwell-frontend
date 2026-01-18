/**
 * Password validation based on regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/
 * Requirements:
 * - At least one digit (0-9)
 * - At least one lowercase letter (a-z)
 * - At least one uppercase letter (A-Z)
 * - At least 6 characters long
 */

export interface PasswordValidationResult {
    isValid: boolean;
    errors: string[];
    errorMessage: string | null;
}

/**
 * Validates a password against the required pattern
 * @param password - The password to validate
 * @returns PasswordValidationResult with validation status and error messages
 */
export function validatePassword(password: string): PasswordValidationResult {
    const errors: string[] = [];

    if (password.length < 6) {
        errors.push("at least 6 characters long");
    }

    if (!/\d/.test(password)) {
        errors.push("at least one number (0-9)");
    }

    if (!/[a-z]/.test(password)) {
        errors.push("at least one lowercase letter (a-z)");
    }

    if (!/[A-Z]/.test(password)) {
        errors.push("at least one uppercase letter (A-Z)");
    }

    const errorMessage = errors.length > 0
        ? `Password must contain: ${errors.join(", ")}`
        : null;

    return {
        isValid: errors.length === 0,
        errors,
        errorMessage,
    };
}

