import app from "./server";
import supertest from "supertest";
import {} from "jest";
import * as admin from "firebase-admin";

let bearer: string = "eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJlbWFpbCI6ImFAYS5jb20iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImF1dGhfdGltZSI6MTYzMzQyMjUzNiwidXNlcl9pZCI6Ill2S1U1SmlGbXZtTDFDcm9WRHNuVEZ2OVRvZmwiLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7ImVtYWlsIjpbImFAYS5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJwYXNzd29yZCJ9LCJpYXQiOjE2MzM0MjI1MzYsImV4cCI6MTYzMzQyNjEzNiwiYXVkIjoiZnVtLWRldiIsImlzcyI6Imh0dHBzOi8vc2VjdXJldG9rZW4uZ29vZ2xlLmNvbS9mdW0tZGV2Iiwic3ViIjoiWXZLVTVKaUZtdm1MMUNyb1ZEc25URnY5VG9mbCJ9.";

// test("GET /unauthenticated", async () => {
//   await supertest(app).get("/unauthenticated").expect(200).then().catch();
// });

test("POST /authenticated with no bearer should error", async () => {
  await supertest(app).post("/authenticated").expect(400).then().catch();
});

test("POST /authenticated with bearer should pass", async () => {
  await supertest(app)
    .post("/authenticated")
    .set("Authorization", 'Bearer ' + bearer)
    .expect(200)
    .then()
    .catch();
});

// test("GET /", async () => {
//   await supertest(app).get("/").expect(200).then().catch();
// });
