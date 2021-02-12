// INFO: Does not work in Edge
// INFO: crypto.subtle.digest is only available via HTTPS connections

// convert bytes to hex string
function bufferToHex(buffer) {
  return [...new Uint8Array(buffer)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function digestMessage(message) {
  const msgUint8 = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
  return bufferToHex(hashBuffer);
}

export default digestMessage;
