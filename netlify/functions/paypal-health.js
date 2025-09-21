const { base, clientId, secret, json } = require("../../lib/paypal");

exports.handler = async () => {
  const clientIdSuffix = clientId ? clientId.slice(-6) : null;
  const hasSecret = Boolean(secret);

  return json(200, {
    base,
    clientIdSuffix,
    hasSecret,
  });
};
