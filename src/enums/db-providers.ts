import { FirestoreDBProvider } from "../db-providers/firestore";
import { DBProvider } from "../interfaces/db-provider";

export enum DBProviders {
  FIRESTORE = "FIRESTORE",
}

export function dbProviderMap(val: DBProviders): DBProvider {
  switch (val) {
    case DBProviders.FIRESTORE:
      return new FirestoreDBProvider();
    default:
      return new FirestoreDBProvider();
  }
}
