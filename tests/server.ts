import * as express from "express";
import * as admin from 'firebase-admin';

import {
  FirebaseUserManagement,
  db,
  auth,
  withAuthentication,
} from "../src/index";

process.env.FIREBASE_AUTH_EMULATOR_HOST = 'localhost:9099'
process.env.FIRESTORE_EMULATOR_HOST = "localhost:8080";

FirebaseUserManagement.initialize({
  dbProvider: new db.FirestoreDBProvider(),
  authProviders: [new auth.FirebaseAuthProvider()],
});

const app = express();

app.use((req, res,next) => {
    console.log(req.method, req.path, req.headers);
    next();
})

app.use('', withAuthentication({
    users: ['QPSv2XtkDoqAyaPaqiArKnsQoHpK'],
    permissions: ['read'],
    resolveUser: true
}), (req: any, res, next) => {
  console.log("Passed authentication!", req.authUser, req.user);
  res.send();
});

export default app;
