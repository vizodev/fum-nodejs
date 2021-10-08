import admin from "firebase-admin";
import { FirebaseUserManagement } from "../index";
import { AuthError } from "../interfaces/auth-error";
import { AuthProvider } from "../interfaces/auth-provider";

export class FirebaseAuthProvider
  implements AuthProvider<admin.auth.DecodedIdToken>
{
  constructor(projectId?: string) {
    if (!admin.apps.length) {
      admin.initializeApp({ projectId });
    }
  }

  async resolveToken(token: string) {
    try {
      const result = await admin.auth().verifyIdToken(token, true);
      FirebaseUserManagement.logger.d("verifyIdToken result", result);
      return this.transformer(result);
    } catch (err) {
      throw this.formatErrors(err);
    }
  }

  transformer(result: admin.auth.DecodedIdToken) {
    return {
      id: result.uid,
      email: result.email,
      organizationsIds: result.organizationsIds,
      teamsIds: result.teamsIds,
      permissions: result.permissions,
      role: result.role,
    };
  }

  formatErrors(err: any) {
    throw new AuthError(err, err.code, err.details ?? "");
  }
}
