import { AuthError } from "./interfaces/auth-error";

export const NOT_INITILIZED_ERROR = new AuthError(
  new Error("not-initialized"),
  "not-initialized",
  "You should initialize FirebaseUserManagement before using it."
);

export const NO_AUTH_PROVIDERS = new AuthError(
  new Error("no-auth-providers"),
  "no-auth-providers",
  "You should pass at least one AuthProvider upon initializing FirebaseUserManagement"
);

export const DB_NOT_INITILIZED_ERROR = new AuthError(
  new Error("not-initialized"),
  "not-initialized",
  "You should initialize a database to resolve a user."
);

export const NO_TOKEN_ERROR = new AuthError(
  new Error("no-token-found"),
  "not-token-found",
  "No token was found in the Authorization header."
);

export const INVALID_TOKEN_ERROR = new AuthError(
    new Error("invalid-token"),
    "invalid-token",
    "The token is invalid"
  );
  
export const UNAUTHORIZED_ERROR = new AuthError(
    new Error("unauthorized"),
    "unauthorized",
    "You're not allowed to perform this operation"
  );
  