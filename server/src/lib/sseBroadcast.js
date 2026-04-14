// SSE client registry – shared across all routes
const clients = new Set();

/**
 * Register a new SSE response object.
 * The caller is responsible for writing the initial headers before calling this.
 */
function addClient(res) {
  clients.add(res);
}

/**
 * Remove a client (called on connection close).
 */
function removeClient(res) {
  clients.delete(res);
}

/**
 * Broadcast a named event with a JSON payload to all connected admin clients.
 */
function broadcast(event, data) {
  const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const res of clients) {
    try {
      res.write(payload);
    } catch {
      clients.delete(res);
    }
  }
}

module.exports = { addClient, removeClient, broadcast };
