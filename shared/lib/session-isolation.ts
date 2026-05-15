export type SessionRole = "USER" | "ADMIN" | "COACH" | "MENTOR" | null;

export type SessionUser = {
  id?: string;
  name: string;
  email: string;
};

export const getAuthSessionKey = ({
  role,
  user,
}: {
  role: SessionRole;
  user?: SessionUser | null;
}) => {
  if (!role || !user) return null;

  const identity = user.id || user.email;
  return identity ? `${role}:${identity}` : null;
};

export const isDifferentAuthSession = (
  currentKey: string | null,
  nextKey: string | null,
) => currentKey !== nextKey;

export const shouldRotateAuthSessionBoundary = (
  currentKey: string | null,
  nextKey: string | null,
) => Boolean(currentKey) && isDifferentAuthSession(currentKey, nextKey);

export const hasActiveSessionState = ({
  accessToken,
  role,
  sessionKey,
  user,
}: {
  accessToken?: string | null;
  role?: SessionRole;
  sessionKey?: string | null;
  user?: SessionUser | null;
}) => Boolean(sessionKey || accessToken || role || user);
