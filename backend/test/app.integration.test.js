import assert from "node:assert/strict";
import { test } from "node:test";
import request from "supertest";

process.env.PORT = "0";
process.env.MONGO_URI = "mongodb://127.0.0.1:27017/ratinocare-tests";
process.env.JWT_SECRET = "integration-test-secret";
process.env.NODE_ENV = "test";

const { default: app } = await import("../src/app.js");

test("GET /api/health returns a healthy API response", async () => {
  const response = await request(app).get("/api/health");

  assert.equal(response.status, 200);
  assert.deepEqual(response.body, {
    success: true,
    message: "RatinoCare API is healthy",
  });
});

test("public registration rejects administrator accounts", async () => {
  const response = await request(app).post("/api/auth/register").send({
    name: "Test Administrator",
    email: "administrator@example.com",
    password: "StrongPassword1!",
    role: "admin",
  });

  assert.equal(response.status, 400);
  assert.equal(response.body.success, false);
  assert.equal(response.body.message, "Invalid role");
});

test("login validation rejects incomplete credentials", async () => {
  const response = await request(app).post("/api/auth/login").send({
    email: "patient@example.com",
  });

  assert.equal(response.status, 400);
  assert.equal(response.body.success, false);
  assert.equal(response.body.message, "Email and Password are required");
});

test("protected appointment routes reject missing authentication", async () => {
  const response = await request(app).get("/api/appointments/my-appointments");

  assert.equal(response.status, 401);
  assert.equal(response.body.success, false);
  assert.equal(response.body.message, "No Token");
});

test("unknown routes return the standard not-found response", async () => {
  const response = await request(app).get("/api/does-not-exist");

  assert.equal(response.status, 404);
  assert.equal(response.body.success, false);
});
