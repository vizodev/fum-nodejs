import * as app from "./server";
import * as admin from "firebase-admin";

app.default.listen(3000, () => console.log("Running server"));
