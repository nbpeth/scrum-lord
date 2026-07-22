const { validateRequest } = require("./auth");

const makeRequest = ({ origin, token } = {}) => ({
  headers: origin ? { origin } : {},
  url: token ? `/socket?token=${token}` : "/socket",
});

describe("validateRequest", () => {
  const prodConfig = {
    apiKey: "key123",
    allowedOrigins: ["localhost:3000", "s.crumlord.com"],
    isProd: true,
  };

  it("allows everything outside production", () => {
    expect(validateRequest(makeRequest(), { isProd: false })).toBe(true);
  });

  it("allows a valid key from an allowed origin", () => {
    const request = makeRequest({
      origin: "https://s.crumlord.com",
      token: "key123",
    });

    expect(validateRequest(request, prodConfig)).toBe(true);
  });

  it("rejects a wrong api key", () => {
    const request = makeRequest({
      origin: "https://s.crumlord.com",
      token: "nope",
    });

    expect(validateRequest(request, prodConfig)).toBe(false);
  });

  it("rejects a disallowed origin", () => {
    const request = makeRequest({
      origin: "https://evil.example.com",
      token: "key123",
    });

    expect(validateRequest(request, prodConfig)).toBe(false);
  });

  it("rejects a missing origin header", () => {
    const request = makeRequest({ token: "key123" });

    expect(validateRequest(request, prodConfig)).toBe(false);
  });

  it("rejects when no allowed origins are configured", () => {
    const request = makeRequest({
      origin: "https://s.crumlord.com",
      token: "key123",
    });

    expect(
      validateRequest(request, { ...prodConfig, allowedOrigins: undefined })
    ).toBe(false);
  });
});
