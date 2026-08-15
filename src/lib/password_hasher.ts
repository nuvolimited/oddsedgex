import bcrypt from "bcrypt";

/**
 * Hashes a password.
 *
 * @param {string} password - The plain text password to hash.
 * @returns {Promise<string>} A promise that resolves to the hashed password.
 */
export async function hashPassword(password: string): Promise<string> {
  // Generate a salt with 12 rounds
  const salt = await bcrypt.genSalt(12);
  // Hash the password using the generated salt
  return await bcrypt.hash(password, salt);
}

/**
 * Verify a password against a stored hashed password
 *
 * @param {string} password The password to verify
 * @param {string} hashedPassword The hashed password to verify against
 * @returns {Promise<boolean>} A promise that resolves to true if the password is valid, false otherwise
 */
export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  // Return true if the two hashes match, false otherwise
  return await bcrypt.compare(password, hashedPassword);
}
