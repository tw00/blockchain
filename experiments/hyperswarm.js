const hyperswarm = require("hyperswarm");
const crypto = require("crypto");
const repl = require("repl");
const swarm = hyperswarm();

// look for peers listed under this topic
const topic = crypto
  .createHash("sha256")
  .update("my-hyperswarm-topic")
  .digest();

const peers = [];
const connections = [];
let replServer = null;

function startRepl() {
  if (replServer) {
    return;
  }

  replServer = repl.start({
    prompt: "hyperswarm> ",
    useColors: true,
  });

  let interval = null;
  const context = {
    peers: peers,
    connections: connections,
    hello: () => connections[0].write("hello"),
    broadcast: (...args) => {
      console.log("Sending to #", connections.length);
      connections.forEach((socket) => {
        socket.write(...args);
      });
    },
    spamOn: () => {
      if (interval) {
        return;
      }
      interval = setInterval(() => {
        const msg = Math.random().toString(16).substring(2, 10);
        console.log(`- sending:`, msg);
        context.broadcast(msg);
      }, 1000);
    },
    spamOff() {
      clearInterval(interval);
    },
    exit() {
      process.exit();
    },
  };

  Object.entries(context).forEach(([key, value]) => {
    replServer.context[key] = value;
  });
}

swarm.join(topic, {
  lookup: true, // find & connect to peers
  announce: true, // optional- announce self as a connection target
});

swarm.on("connection", (socket, info) => {
  const { peer } = info;
  let direction;
  if (!peer) {
    console.log("\n- new incomming connection", peer);
    direction = "in";
  } else {
    console.log(`\n- new outgoing connection: ${peer.host}:${peer.port}`);
    direction = "out";
  }

  // process.stdin.pipe(socket).pipe(process.stdout);

  if (direction === "in") {
    socket.on("data", (data) => {
      console.log(`\n- recv [${direction}]:`, data.toString());
    });
  }

  if (direction === "out") {
    peers.push(peer);
    connections.push(socket);
  }

  setTimeout(() => startRepl(), 500);
});
