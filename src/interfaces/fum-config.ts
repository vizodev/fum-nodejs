import { AuthProvider } from "./auth-provider";
import { DBProvider } from "./db-provider";

export interface FUMConfig {
  authProviders: AuthProvider<any>[];

  dbProvider: DBProvider;

  logLevel?: "v" | "d" | "w" | "e";
}
