export const getPublicAppUrl = (): string => {
  if (typeof window === 'undefined') {
    return 'https://ais-pre-xipez3lvcu7al5o43limfd-164900540009.europe-west2.run.app';
  }

  // Use the active working origin directly so it never 404s
  const origin = window.location.origin;

  if (origin && !origin.includes('localhost') && !origin.includes('127.0.0.1')) {
    return origin;
  }

  return 'https://ais-pre-xipez3lvcu7al5o43limfd-164900540009.europe-west2.run.app';
};
