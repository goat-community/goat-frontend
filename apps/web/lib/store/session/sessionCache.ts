import { getSession } from "next-auth/react";
import { parseISO, isAfter } from "date-fns";

let sessionCache: { accessToken: string | null; expiresAt: Date | null } = {
  accessToken: null,
  expiresAt: null,
};

export const getSessionToken = async () => {
  const currentTime = new Date();
  if (sessionCache.accessToken && sessionCache.expiresAt && isAfter(sessionCache.expiresAt, currentTime)) {
    console.log("Returning cached access token: ", sessionCache.accessToken);
    return sessionCache.accessToken;
  }

  const session = await getSession();
  if (session?.access_token && session?.expires) {
    const expiresAt = parseISO(session.expires); // Parse ISO string to Date
    sessionCache.accessToken = session.access_token;
    sessionCache.expiresAt = expiresAt;
    return session.access_token;
  }

  return null;
};

export const clearSessionToken = () => {
  sessionCache.accessToken = null;
  sessionCache.expiresAt = null;
};
