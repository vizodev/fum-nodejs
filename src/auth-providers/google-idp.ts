import { AuthError } from "../interfaces/auth-error";
import { AuthProvider } from "../interfaces/auth-provider";
import { OAuth2Client, TokenPayload } from "google-auth-library";

export class GoogleIDPAuthProvider
  implements AuthProvider<TokenPayload>
{
  private auth: OAuth2Client;
  private audience: string[] = [];

  constructor(audience: string[]) {
    this.auth = new OAuth2Client();
    this.audience = audience;
  }

  async resolveToken(token: string) {
    try {
      const result = await this.auth.verifyIdToken({
        idToken: token,
        audience: this.audience,
      });
      return this.transformer(result.getPayload());
    } catch (err) {
      throw this.formatErrors(err);
    }
  }

  transformer(result: any) {
    return {
      id: result.uid ?? result.email,
      email: result.email,
      organizationsIds: result.organizationsIds ?? [],
      teamsIds: result.teamsIds ?? [],
      permissions: result.permissions ?? [],
      role: result.role ?? '',
    };
  }

  formatErrors(err: any) {
    throw new AuthError(err, err.code, err.details ?? "");
  }
}
