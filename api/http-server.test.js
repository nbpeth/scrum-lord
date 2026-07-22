const request = require("supertest");
const { createApp } = require("./http-server");

describe("http-server", () => {
  const originalEnv = process.env.ENV;

  afterEach(() => {
    process.env.ENV = originalEnv;
  });

  it("sets CORS headers on every response", async () => {
    delete process.env.ENV;
    const res = await request(createApp()).get("/anything");

    expect(res.headers["access-control-allow-origin"]).toBe("*");
    expect(res.headers["access-control-allow-headers"]).toContain("Origin");
  });

  it("redirects http traffic to https in production", async () => {
    process.env.ENV = "production";

    const res = await request(createApp())
      .get("/some/path")
      .set("Host", "s.crumlord.com");

    expect(res.status).toBe(302);
    expect(res.headers.location).toBe("https://s.crumlord.com/some/path");
  });

  it("does not redirect when the request is already https", async () => {
    process.env.ENV = "production";

    const res = await request(createApp())
      .get("/some/path")
      .set("x-forwarded-proto", "https");

    expect(res.status).not.toBe(302);
  });

  it("does not redirect outside production", async () => {
    delete process.env.ENV;

    const res = await request(createApp()).get("/some/path");

    expect(res.status).not.toBe(302);
  });
});
