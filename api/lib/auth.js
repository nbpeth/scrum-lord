const url = require("url");

const validateRequest = (request, { apiKey, allowedOrigins, isProd }) => {
  if (!isProd) {
    return true;
  }

  const { origin } = request.headers;
  const originHost = url.parse(origin ?? "", false, false);
  const queryParams = url.parse(request.url, { parseQueryString: true }).query;

  return (
    queryParams.token === apiKey &&
    Boolean(allowedOrigins?.includes(originHost?.host))
  );
};

module.exports = { validateRequest };
