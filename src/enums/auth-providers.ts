 import { FirebaseAuthProvider } from "../auth-providers/firebase";
import { AuthProvider } from "../interfaces/auth-provider";

export enum AuthProviders {
  FIREBASE_AUTH = "FIREBASE_AUTH",
  GOOGLE_IDP = "GOOGLE_IDP",
}

export function authProviderMap(val: AuthProviders): AuthProvider<any> {
  switch (val) {
    case AuthProviders.FIREBASE_AUTH:
      return new FirebaseAuthProvider();
    default:
      return new FirebaseAuthProvider();
  }
}
