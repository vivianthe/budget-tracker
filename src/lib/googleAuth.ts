const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string;
const SCOPE = "https://www.googleapis.com/auth/spreadsheets";

declare global {
  interface Window {
    google: any;
  }
}

let tokenClient: any = null;
let accessToken: string | null = null;

function ensureTokenClient() {
  if (tokenClient) return tokenClient;
  if (!window.google?.accounts?.oauth2) {
    throw new Error("Google Identity Services script has not loaded yet.");
  }
  tokenClient = window.google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPE,
    callback: () => {}, // overridden per-call in signIn()
  });
  return tokenClient;
}

export function signIn(): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const client = ensureTokenClient();
      client.callback = (response: any) => {
        if (response.error) {
          reject(new Error(response.error));
          return;
        }
        accessToken = response.access_token;
        resolve(response.access_token);
      };
      client.requestAccessToken({ prompt: accessToken ? "" : "consent" });
    } catch (err) {
      reject(err);
    }
  });
}

export function signOut() {
  if (accessToken && window.google?.accounts?.oauth2) {
    window.google.accounts.oauth2.revoke(accessToken, () => {});
  }
  accessToken = null;
}

export function getAccessToken(): string | null {
  return accessToken;
}

export function isSignedIn(): boolean {
  return accessToken !== null;
}
