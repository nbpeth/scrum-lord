const { getSocketBaseUrl } = require("./config");

describe("config", () => {
  describe("getSocketBaseUrl", () => {
    afterEach(() => {
      delete process.env.REACT_APP_SERVER_PORT;
      delete global.window.location.host;
      delete global.window.location.protocol;
      delete global.window.location.port;
      delete global.window.location.hostname;
    });

    const setEnv = ({ host, hostname, protocol, port } = {}) => {
      if(port) {
        process.env.REACT_APP_SERVER_PORT = port;
      }
      const location = {
        host: host ?? "localhost:8080",
        hostname: hostname ?? "localhost",
        port: port ?? "8080",
        protocol: protocol ?? "http:",
      };
      delete global.window.location;
      global.window = Object.create(window);
      global.window.location = location;
    };

    it("should return unsecure local url when env is not production and connection is http", () => {
      setEnv();
      expect(getSocketBaseUrl()).toEqual("ws://localhost:8080");
    });

    it("should return secure local url when env is not production and connection is https", () => {
      setEnv({ protocol: "https:", host: "localhost:8081" });
      expect(getSocketBaseUrl()).toEqual("wss://localhost:8081");
    });

    it("should override port when provided in environment", () => {
        setEnv({ protocol: "https:", host: "localhost:3000", hostname: "localhost", port: "9999" });
        expect(getSocketBaseUrl()).toEqual("wss://localhost:9999");
      });

    it("should return secure local url when connection is https", () => {
      setEnv({ protocol: "https:", host: "localhost:8081" });
      expect(getSocketBaseUrl()).toEqual("wss://localhost:8081");
    });

    it("should return unsecure production url when connection is http", () => {
      setEnv({ protocol: "http:", host: "some-host.com" });
      expect(getSocketBaseUrl()).toEqual("ws://some-host.com");
    });

    it("should return secure production url when connection is https", () => {
      setEnv({ protocol: "https:", host: "some-host.com" });
      expect(getSocketBaseUrl()).toEqual("wss://some-host.com");
    });
  });
});
