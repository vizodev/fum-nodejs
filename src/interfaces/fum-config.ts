import { Logger } from "../utils/logger";
import { AuthProvider } from "./auth-provider";
import { DBProvider } from "./db-provider";
export interface FUMConfig {
  authProviders: AuthProvider<any>[];

  dbProvider?: DBProvider;

  logger?: typeof Logger,

  logLevel?: "v" | "d" | "w" | "e";
}
