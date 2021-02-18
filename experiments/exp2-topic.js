const hyperswarm = require("hyperswarm");
const crypto = require("crypto");
const repl = require("repl");
const swarm = hyperswarm();

// look for peers listed under this topic
const topic = crypto.createHash("sha256").update("econicoin").digest("hex");

console.log("topic", topic);
