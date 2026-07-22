import { afterEach, describe, expect, it, vi } from "vitest";
import { getSocketBaseUrl } from "./config";

const setLocation = ({ host, hostname, protocol, port } = {}) => {
  Object.defineProperty(window, "location", {
    value: {
      host: host ?? "localhost:8080",
      hostname: hostname ?? "localhost",
      port: port ?? "8080",
      protocol: protocol ?? "http:",
    },
    writable: true,
    configurable: true,
  });
};

describe("config", () => {
  describe("getSocketBaseUrl", () => {
    afterEach(() => {
      vi.unstubAllEnvs();
    });

    it("returns an unsecure url when the connection is http", () => {
      setLocation();
      expect(getSocketBaseUrl()).toEqual("ws://localhost:8080");
    });

    it("returns a secure url when the connection is https", () => {
      setLocation({ protocol: "https:", host: "localhost:8081" });
      expect(getSocketBaseUrl()).toEqual("wss://localhost:8081");
    });

    it("overrides the port when provided in the environment", () => {
      vi.stubEnv("VITE_SERVER_PORT", "9999");
      setLocation({
        protocol: "https:",
        host: "localhost:3000",
        hostname: "localhost",
      });
      expect(getSocketBaseUrl()).toEqual("wss://localhost:9999");
    });

    it("returns an unsecure production url when the connection is http", () => {
      setLocation({ protocol: "http:", host: "some-host.com" });
      expect(getSocketBaseUrl()).toEqual("ws://some-host.com");
    });

    it("returns a secure production url when the connection is https", () => {
      setLocation({ protocol: "https:", host: "some-host.com" });
      expect(getSocketBaseUrl()).toEqual("wss://some-host.com");
    });
  });
});
