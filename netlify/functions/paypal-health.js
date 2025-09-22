const { base, mode, clientIdSuffix, secret, json } = require("../../lib/paypal");

exports.handler = async () => {
  return json(200, {
    base,
    mode,
    clientIdSuffix: clientIdSuffix || null,
    hasSecret: Boolean(secret),
  });
};
