import { AuthUser } from "./auth-user";
import { Organization } from "./organization";
import { Team } from "./team";
import { User } from "./user";

export interface DBProvider {
  resolveAuthUser: (
    authUser: AuthUser,
    config?: { resolveOrganizations?: boolean; resolveTeams?: boolean }
  ) => Promise<User>;

  getUser: (id: string) => Promise<User>;

  getOrganizations: (ids: string[]) => Promise<Organization[]>;

  getTeams: (ids: string[]) => Promise<Team[]>;

  /**
   * @throws {AuthError}
   */
  formatErrors: (err: any) => void;
}
