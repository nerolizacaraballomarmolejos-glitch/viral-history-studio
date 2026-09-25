/** Client-safe. No imports de @clerk/nextjs. */
export const isClerkConfigured = (): boolean =>
  !!(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
