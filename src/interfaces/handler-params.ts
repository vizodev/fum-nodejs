import { Request } from "express";
import { User } from "./user";

export interface HandlerParams {

    resolveOrganizations?: boolean;
    
    resolveTeams?: boolean;

    resolveUser?: boolean;

    roles?: string[],

    permissions?: string[],

    organizations?: string[],

    teams?: string[],

    users?: string[],

    emails?: string[],

    ignoreResolveForEmails?: string[],

    authResolver?: (req: Request, user: User) => Promise<boolean> | boolean,

}