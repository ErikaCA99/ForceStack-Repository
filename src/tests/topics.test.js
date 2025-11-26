const request = require("supertest");
const app = require("../server.js");

describe("API básica", () => {
  test("GET /api/health debe responder con ok:true", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
  });
});
