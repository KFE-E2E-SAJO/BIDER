export const checkIsAuthenticated = (isMounted: Boolean) => {
  if (typeof window === 'undefined' || !isMounted) return false;

  const tokenData = localStorage.getItem('sb-nrxemenkpeejarhejbbk-auth-token');

  if (!tokenData) return false;

  try {
    return JSON.parse(tokenData).access_token;
  } catch {
    return false;
  }
};
