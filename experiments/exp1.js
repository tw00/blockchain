const crypto = require("crypto");
// const hash = crypto.createHash("sha256");

const secret = "abcdefg";
// const hash = crypto
//   .createHmac("sha256", secret)
//   .update("I love cupcakes")
//   .digest("hex");

const hash = crypto
  .createHash("sha256")
  .update("I love cupcakes")
  .digest("hex");

console.log(hash);
