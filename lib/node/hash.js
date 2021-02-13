const crypto = require("crypto");

function SHA256(text) {
  return crypto.createHash("sha256").update(text).digest("hex");
}

export default SHA256;
