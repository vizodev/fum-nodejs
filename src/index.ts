import { authProviderMap, AuthProviders } from "./enums/auth-providers";
import { dbProviderMap, DBProviders } from "./enums/db-providers";
import { INVALID_TOKEN_ERROR, NO_TOKEN_ERROR } from "./errors";
import { AuthProvider } from "./interfaces/auth-provider";
import { AuthUser } from "./interfaces/auth-user";
import { DBProvider } from "./interfaces/db-provider";
import { FUMConfig } from "./interfaces/fum-config";
import { withAuthentication } from "./middlewares/with-authentication";
import { FirestoreDBProvider } from "./db-providers";
import { FirebaseAuthProvider, GoogleIDPAuthProvider } from "./auth-providers";
import { Logger } from "./utils/log";
import { AuthError } from "./interfaces/auth-error";

export class FirebaseUserManagement {
  static instance: FirebaseUserManagement;

  private _config: FUMConfig;
  private _authProviders: AuthProvider<any>[] = [];
  private _dbProvider: DBProvider;

  static initialize(config: FUMConfig): FirebaseUserManagement {
    FirebaseUserManagement.instance = new FirebaseUserManagement(config);
    return FirebaseUserManagement.instance;
  }

  private constructor(config: FUMConfig) {
    this._config = config;
    this.initializeAuthProviders(config.authProviders);
    this.initializeDBProvider(config.dbProvider);
  }

  private initializeAuthProviders(providers: AuthProvider<any>[]) {
    this._authProviders.push(...providers);
  }

  private initializeDBProvider(provider: DBProvider) {
    this._dbProvider = provider;
  }

  public async resolveToken(token: string) {
    if (!token) {
      throw NO_TOKEN_ERROR;
    }

    for await (const p of this._authProviders) {
      try {
        const authUser = await p.resolveToken(token);
        if (authUser) return authUser;
      } catch (error) {
        Logger.instance.d(error)
      }
    }

    throw INVALID_TOKEN_ERROR;
  }

  public async resolveUser(
    authUser: AuthUser,
    config?: { resolveOrganizations?: boolean; resolveTeams?: boolean }
  ) {
    try {
      
      return await this._dbProvider.resolveAuthUser(authUser, config);
    } catch (error) {
      throw AuthError.fromError(error);
    }
  }
}


Logger.initialize('e');

const db = { FirestoreDBProvider };
const auth = { FirebaseAuthProvider, GoogleIDPAuthProvider };
export { withAuthentication, db, auth };
