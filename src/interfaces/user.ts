import { AuthUser } from "./auth-user";
import { Organization } from "./organization";
import { Team } from "./team";

export interface User extends AuthUser {
    id: string;
    name: string;
    email: string;
    organizations?: Organization[];
    teams?: Team[];
    roles: string[];
    permissions: string[];
}