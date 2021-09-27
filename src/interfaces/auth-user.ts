
export interface AuthUser {
    id: string;
    email: string;
    organizationsIds?: string[];
    teamsIds?: string[];
    role: string;
    permissions: string[];
}