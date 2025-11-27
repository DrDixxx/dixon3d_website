const { base, mode, clientId, secret, json } = require("../../lib/paypal");

exports.handler = async () => {
  const clientIdSuffix = clientId ? clientId.slice(-6) : null;

  return json(200, {
    base,
    mode,
    clientIdSuffix,
    hasSecret: Boolean(secret),
  });
};
