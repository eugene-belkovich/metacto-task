export const jwt = {
  isExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  },

  decode<T = Record<string, unknown>>(token: string): T | null {
    try {
      return JSON.parse(atob(token.split('.')[1])) as T;
    } catch {
      return null;
    }
  },
};
