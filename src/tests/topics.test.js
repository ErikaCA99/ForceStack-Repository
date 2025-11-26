const request = require("supertest");
const app = require("../app.js").default;

describe("API básica", () => {
  test("GET / debe devolver el login", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
  });
});
