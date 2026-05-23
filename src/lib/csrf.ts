const STORAGE_KEY = "urm-csrf-token";

const generateToken = () => {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
};

export const getCsrfToken = () => {
  const stored = sessionStorage.getItem(STORAGE_KEY);
  if (stored) return stored;
  const token = generateToken();
  sessionStorage.setItem(STORAGE_KEY, token);
  return token;
};
