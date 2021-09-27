import { ProviderUserTransformer } from "../types/provider-user-transformer";
import { AuthUser } from "./auth-user";
import { AuthError } from "./auth-error";

export interface AuthProvider<T> {

    resolveToken: (token: string) => Promise<AuthUser>;

    transformer:  ProviderUserTransformer<T>;

    /**
     * @throws {AuthError}
     */
    formatErrors: (err: any) => void;

}