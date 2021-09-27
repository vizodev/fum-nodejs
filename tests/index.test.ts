
const app = require('./server');
const supertest = require("supertest");

test("GET /", async () => {

  
  await supertest(app).get("/")
    .expect(200)
    .then()
    .catch()
})