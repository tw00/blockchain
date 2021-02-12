const crypto = require("crypto");

export default function SHA256(text) {
  return crypto.createHash("sha256").update(text).digest("hex");
}
