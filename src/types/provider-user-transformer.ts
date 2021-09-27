import { AuthUser } from "../interfaces/auth-user";

export type ProviderUserTransformer<T> = (result: T) => AuthUser