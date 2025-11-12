import request from "supertest";
import app from "../server.js";

describe("API básica", () => {
  test("GET /api/health debe responder con ok:true", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
  });
});
