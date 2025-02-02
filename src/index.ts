// server.ts
import express from "express";
import Docker from "dockerode";
import cors from "cors";
import { Readable } from "stream";

const app = express();
const PORT = process.env.PORT || 8000;

// Enable CORS so the Vercel dashboard can access this API
app.use(cors());

const docker = new Docker({ socketPath: "/var/run/docker.sock" });

/**
 * Converts a Readable stream to a string.
 */
function streamToString(stream: Readable): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = "";
    stream.on("data", (chunk) => {
      data += chunk.toString("utf8");
    });
    stream.on("end", () => resolve(data));
    stream.on("error", reject);
  });
}

/**
 * API endpoint to fetch logs from a specific container.
 */
app.get("/logs", async (req, res) => {
  try {
    // Use an environment variable or hardcode your container ID/name.
    const containerId =
      process.env.EXPRESS_CONTAINER_ID || "your-express-container-id";
    const container = docker.getContainer(containerId);

    // Options: adjust as necessary (e.g., tail 100 lines, include timestamps, etc.)
    const logStream = await container.logs({
      stdout: true,
      stderr: true,
      timestamps: true,
      tail: 100, // get the last 100 lines
    });

    const logsString = await streamToString(logStream as unknown as Readable);
    const logs = logsString.split("\n").filter(Boolean);
    res.json({ logs });
  } catch (error: any) {
    res
      .status(500)
      .json({ error: error.message || "Error fetching container logs" });
  }
});

app.listen(PORT, () => {
  console.log(`Log service listening on port ${PORT}`);
});
