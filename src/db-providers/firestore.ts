import { AuthUser } from "../interfaces/auth-user";
import { DBProvider } from "../interfaces/db-provider";
import { User } from "../interfaces/user";

import admin from "firebase-admin";
import {
  FUM_ORGANIZATIONS_COLLECTION,
  FUM_TEAMS_COLLECTION,
  FUM_USERS_COLLECTION,
} from "../constants";
import { Organization } from "../interfaces/organization";
import { Team } from "../interfaces/team";
import { AuthError } from "../interfaces/auth-error";

export class FirestoreDBProvider implements DBProvider {
  private usersCollection: admin.firestore.CollectionReference;
  private organizationsCollection: admin.firestore.CollectionReference;
  private teamsCollection: admin.firestore.CollectionReference;

  constructor(projectId?: string) {
    if (!admin.apps.length) {
      admin.initializeApp({ projectId });
    }

    this.usersCollection = admin.firestore().collection(FUM_USERS_COLLECTION);
    this.organizationsCollection = admin
      .firestore()
      .collection(FUM_ORGANIZATIONS_COLLECTION);
    this.teamsCollection = admin.firestore().collection(FUM_TEAMS_COLLECTION);
  }

  getUser(id: string) {
    return this.usersCollection
      .doc(id)
      .get()
      .then((snap) => {
        if (!snap.exists)
          throw { code: "not-found", details: "User not found" };
        const data = snap.data();
        return {
          id: snap.id,
          name: data.name,
          email: data.email,
          roles: data.roles,
          permissions: data.permissions,
          ...data,
        };
      });
  }

  getOrganization(id: string) {
    return this.organizationsCollection
      .doc(id)
      .get()
      .then((snap) => {
        if (!snap.exists)
          throw { code: "not-found", details: "Organization not found" };
        const data = snap.data();
        return {
          id: snap.id,
          name: data.name,
          ...data,
        };
      });
  }

  getTeam(id: string) {
    return this.teamsCollection
      .doc(id)
      .get()
      .then((snap) => {
        if (!snap.exists)
          throw { code: "not-found", details: "Team not found" };
        const data = snap.data();
        return {
          id: snap.id,
          name: data.name,
          ...data,
        };
      });
  }

  getOrganizations(ids: string[]) {
    return Promise.all(ids.map((id) => this.getOrganization(id)));
  }

  getTeams(ids: string[]) {
    return Promise.all(ids.map((id) => this.getTeam(id)));
  }

  async resolveAuthUser(
    authUser: AuthUser,
    config?: { resolveOrganizations?: boolean; resolveTeams?: boolean }
  ) {
    const p: any = [this.getUser(authUser.id)];

    if (config?.resolveOrganizations && authUser.organizationsIds?.length)
      p.push(this.getOrganizations(authUser.organizationsIds));
    else p.push((() => {})());

    if (config?.resolveTeams && authUser.teamsIds?.length)
      p.push(this.getTeams(authUser.teamsIds));
    else p.push((() => {})());

    const [user, organizations, teams]: [
      User,
      Organization[] | undefined,
      Team[] | undefined
    ] = (await Promise.all(p)) as any;

    return {
      ...user,
      organizations,
      teams,
    };
  }

  formatErrors(err: any) {
    throw new AuthError(err, err.code, err.details ?? "");
  }
}
