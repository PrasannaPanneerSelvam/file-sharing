const express = require("express");
const fs = require("fs");
const path = require("path");
const WebSocket = require("ws");

const app = express();
const port = 3000;
const UPLOAD_DIR = "./uploads";

// WebSocket server setup
const wss = new WebSocket.Server({ noServer: true });

wss.on("connection", (ws) => {
  console.log("New WebSocket connection established");
  let fileName = "";
  let fileStream = null;

  // Receive incoming file data in chunks and save it
  ws.on("message", (message) => {
    const buffer = Buffer.from(message);

    if (!fileStream) {
      // First message, expected to be the file name
      fileName = buffer.toString("utf-8");
      console.log(`Receiving file: ${fileName}`);

      fileStream = fs.createWriteStream(path.join(UPLOAD_DIR, fileName));
      return;
    }

    // Write the incoming buffer data (file chunks)
    fileStream.write(buffer);
  });

  ws.on("close", () => {
    console.log("File transfer complete.");
    if (fileStream) {
      fileStream.end(); // End the file stream
      fileStream = null;
    }
  });

  ws.on("error", (err) => {
    console.error("WebSocket error:", err);
    if (fileStream) {
      fileStream.end(); // End the file stream on error
      fileStream = null;
    }
  });
});

// Server and WebSocket handling
app.server = app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

app.server.on("upgrade", (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit("connection", ws, request);
  });
});
