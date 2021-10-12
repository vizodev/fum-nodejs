
export interface AuthUser {
    id: string;
    email: string;
    organizationsIds?: string[];
    teamsIds?: string[];
    roles: string[];
    permissions: string[];
}