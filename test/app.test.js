import request from "supertest";
import app from "../src/app.js";
import { strict as assert } from "assert";

describe("Basic API", function () {
  it("GET /health should return status ok", async function () {
    const res = await request(app).get("/health");
    assert.equal(res.status, 200);
    assert.equal(res.body.status, "ok");
  });

  it("GET /api-docs should return HTML", async function () {
    const res = await request(app).get("/api-docs");
    // swagger UI may redirect; accept 200 or 301
    assert.ok(
      res.status === 200 || res.status === 301,
      `Unexpected status ${res.status}`
    );
    if (res.status === 200) {
      assert.match(res.header["content-type"], /text\/html/);
    } else if (res.status === 301) {
      assert.ok(res.header.location, "Redirect location missing");
    }
  });
});
