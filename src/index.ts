import * as pendo from "pendo-server-sdk";
import { createApp } from "./app.js";

// Pendo Agent Analytics for the Tripwise Assistant. Runs once, before the server starts.
// Set PENDO_DISABLED=true in the environment to turn it off.
pendo.init({
  apiKey: "8c17e06c-4cdb-4053-b5b1-81d4efa88214",
  agentId: "3vYPBkwBW4VH7y4YNxgCG28uYLg",
  endpoint: "https://app.pendo-dev.pendo-dev.com",
  autoPatch: true,
});

const port = Number(process.env.PORT) || 3001;
const corsOrigin = process.env.CORS_ORIGIN ?? "http://localhost:5173";

const server = createApp(corsOrigin).listen(port, () => {
  console.log(`Tripwise API on port ${port}, allowing ${corsOrigin}`);
});

/** Stops taking requests and sends Pendo's buffered events before the process exits. */
async function stop(): Promise<void> {
  server.close();
  await pendo.shutdown();
  process.exit(0);
}

process.on("SIGINT", () => void stop());
process.on("SIGTERM", () => void stop());
