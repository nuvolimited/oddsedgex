export const EXPIRY_TIMES = [
  "48 hours",
  "72 hours",
  "96 hours",
  "120 hours",
  "144 hours",
  "148 hours",
  "192 hours",
  "2 weeks",
] as const;

export type ExpiryTime = typeof EXPIRY_TIMES[number];