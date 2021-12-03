import express from "express";
import * as admin from "firebase-admin";

import {
  FirebaseUserManagement,
  db,
  auth,
  withAuthentication,
} from "../src/index";
import { FirebaseFunctionsLogger } from "../src/loggers/firebase-functions-logger";

process.env.FIREBASE_AUTH_EMULATOR_HOST = "localhost:9099";
process.env.FIRESTORE_EMULATOR_HOST = "localhost:8080";

FirebaseUserManagement.initialize({
  dbProvider: new db.FirestoreDBProvider(),
  authProviders: [new auth.FirebaseAuthProvider()],
  logger: FirebaseFunctionsLogger,
});

const app = express();

app.use((req, res, next) => {
  console.log(req.method, req.path, req.headers);
  next();
});

app.get("/unauthenticated", (req: any, res, next) => {
  console.log("Passed authentication!", req.authUser, req.user);
  res.send();
});

app.post("/authenticated", withAuthentication(), (req: any, res, next) => {
  console.log("Passed authentication!", req.authUser, req.user);
  res.send();
});

app.post(
  "/",
  withAuthentication({
    users: ["QPSv2XtkDoqAyaPaqiArKnsQoHpK"],
    permissions: ["read"],
    resolveUser: true,
  }),
  (req: any, res, next) => {
    console.log("Passed authentication!", req.authUser, req.user);
    res.send();
  }
);

export default app;
