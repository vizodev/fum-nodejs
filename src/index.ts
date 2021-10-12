import { authProviderMap, AuthProviders } from "./enums/auth-providers";
import { dbProviderMap, DBProviders } from "./enums/db-providers";
import {
  DB_NOT_INITILIZED_ERROR,
  INVALID_TOKEN_ERROR,
  NO_AUTH_PROVIDERS,
  NO_TOKEN_ERROR,
} from "./errors";
import { AuthProvider } from "./interfaces/auth-provider";
import { AuthUser } from "./interfaces/auth-user";
import { DBProvider } from "./interfaces/db-provider";
import { FUMConfig } from "./interfaces/fum-config";
import { withAuthentication } from "./middlewares/with-authentication";
import { FirestoreDBProvider } from "./db-providers";
import { FirebaseAuthProvider, GoogleIDPAuthProvider } from "./auth-providers";
import { Logger, FirebaseFunctionsLogger } from "./loggers";
import { AuthError } from "./interfaces/auth-error";

export class FirebaseUserManagement {
  static instance: FirebaseUserManagement;

  static logger: Logger;

  private _config: FUMConfig;
  private _authProviders: AuthProvider<any>[] = [];
  private _dbProvider: DBProvider;

  static initialize(config: FUMConfig): FirebaseUserManagement {
    this.logger = new (config?.logger || Logger)(config.logLevel);
    FirebaseUserManagement.instance = new FirebaseUserManagement(config);
    return FirebaseUserManagement.instance;
  }

  private constructor(config: FUMConfig) {
    this._config = config;
    if (!config.authProviders?.length) throw NO_AUTH_PROVIDERS;
    this.initializeAuthProviders(config.authProviders);
    if (config.dbProvider) this.initializeDBProvider(config.dbProvider);
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
        FirebaseUserManagement.logger.d(error);
      }
    }

    throw INVALID_TOKEN_ERROR;
  }

  public async resolveUser(
    authUser: AuthUser,
    config?: { resolveOrganizations?: boolean; resolveTeams?: boolean }
  ) {
    if (!this._dbProvider) throw DB_NOT_INITILIZED_ERROR;
    try {
      return await this._dbProvider.resolveAuthUser(authUser, config);
    } catch (error) {
      throw AuthError.fromError(error);
    }
  }
}

const db = { FirestoreDBProvider };
const auth = { FirebaseAuthProvider, GoogleIDPAuthProvider };
const logger = { Logger, FirebaseFunctionsLogger }
export { withAuthentication, db, auth, logger };
