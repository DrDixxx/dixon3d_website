const { getAccessToken, base, mode, clientId, json } = require("../../lib/paypal");

exports.handler = async () => {
  const clientIdSuffix = clientId ? clientId.slice(-6) : null;
  const diag = { mode, base, clientIdSuffix };

  try {
    await getAccessToken();
    return json(200, { ok: true, mode, base, clientIdSuffix });
  } catch (error) {
    return json(500, {
      ok: false,
      error: error instanceof Error ? error.message : String(error),
      diag,
    });
  }
};
