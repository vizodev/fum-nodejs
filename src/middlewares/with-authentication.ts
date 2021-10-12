import { Request, Response, NextFunction, Handler } from "express";
import { FirebaseUserManagement } from "..";
import { HandlerParams } from "../interfaces/handler-params";
import { AuthError } from "../interfaces/auth-error";
import { getToken } from "../utils/get-token";
import { NOT_INITILIZED_ERROR, UNAUTHORIZED_ERROR } from "../errors";
import { AuthUser } from "../interfaces/auth-user";
import { User } from "../interfaces/user";

export const withAuthentication = (params?: HandlerParams) => {
  FirebaseUserManagement.logger.v("Started withAuthentication");
  return async (
    req: Request & { user?: User; authUser?: AuthUser },
    res: Response,
    next: NextFunction
  ) => {
    const instance = FirebaseUserManagement.instance;
    if (!instance) {
      FirebaseUserManagement.logger.e("No instance of FUM found");
      return NOT_INITILIZED_ERROR.toResponse(res);
    }
    FirebaseUserManagement.logger.d("Found instance", instance);

    let authUser: AuthUser;

    try {
      authUser = await instance.resolveToken(getToken(req));
    } catch (error) {
      console.log("Got error", error instanceof AuthError);

      if (error instanceof AuthError) return error.toResponse(res);
      throw error;
    }
    req.authUser = authUser;

    if (!params) {
      next();
      return;
    }

    if (
      params?.roles &&
      authUser.roles &&
      params?.roles.some((r) => authUser.roles.includes(r))
    ) {
      getUser(instance, authUser, req, res, next, params);
      return;
    }

    if (
      params?.permissions &&
      params?.permissions.some((p) => authUser.permissions?.includes(p))
    ) {
      getUser(instance, authUser, req, res, next, params);
      return;
    }

    if (
      params?.organizations &&
      params?.organizations.some((p) => authUser.organizationsIds?.includes(p))
    ) {
      getUser(instance, authUser, req, res, next, params);
      return;
    }

    if (
      params?.teams &&
      params?.teams.some((p) => authUser.teamsIds?.includes(p))
    ) {
      getUser(instance, authUser, req, res, next, params);
      return;
    }

    if (params?.users && params?.users.includes(authUser.id)) {
      getUser(instance, authUser, req, res, next, params);
      return;
    }

    if (params?.emails && params?.emails.includes(authUser.email)) {
      if (
        params?.ignoreResolveForEmails &&
        params?.ignoreResolveForEmails.includes(authUser.email)
      ) {
        next();
        return;
      }
      getUser(instance, authUser, req, res, next, params);
      return;
    }

    if (
      params?.resolveOrganizations ||
      params?.resolveTeams ||
      params?.resolveUser ||
      params?.authResolver
    ) {
      getUser(instance, authUser, req, res, next, params);
      return;
    }

    return UNAUTHORIZED_ERROR.toResponse(res);
  };
};

async function getUser(
  instance: FirebaseUserManagement,
  authUser: AuthUser,
  req: any,
  res: Response,
  next: NextFunction,
  params?: HandlerParams
) {
  if (
    params?.resolveOrganizations ||
    params?.resolveTeams ||
    params?.resolveUser ||
    params?.authResolver
  ) {
    let user: User;
    try {
      user = await instance.resolveUser(authUser, {
        resolveTeams: params?.resolveTeams,
        resolveOrganizations: params?.resolveOrganizations,
      });
    } catch (error) {
      if (error instanceof AuthError) return error.toResponse(res);
      throw error;
    }
    req.user = user;

    if (
      (params?.authResolver && (await params?.authResolver(req, user))) ||
      !params?.authResolver
    ) {
      next();
      return;
    } else {
      return UNAUTHORIZED_ERROR.toResponse(res);
    }
  } else {
    next();
    return;
  }
}
