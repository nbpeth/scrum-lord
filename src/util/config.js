const getSocketBaseUrl = () => {
  const host = window.location.host;
  const hostname = window.location.hostname;
  const wsProtocol = window.location.protocol === "https:" ? "wss" : "ws";
  const serverPort = process.env.REACT_APP_SERVER_PORT;

  if(serverPort) {
    return `${wsProtocol}://${hostname}:${serverPort}`;
  }

  return `${wsProtocol}://${host}`;
};

module.exports = {
  getSocketBaseUrl,
};
