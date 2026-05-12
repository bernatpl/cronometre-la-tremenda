const http = require("http");
const fs = require("fs");
const path = require("path");

const root = __dirname;
const port = Number(process.env.PORT || 4173);
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
};

http
  .createServer((request, response) => {
    const url = new URL(request.url, "http://127.0.0.1");
    const requestPath = url.pathname === "/" ? "index.html" : url.pathname.slice(1);
    const file = path.resolve(root, requestPath);

    if (!file.startsWith(root)) {
      response.writeHead(403);
      response.end("Forbidden");
      return;
    }

    fs.readFile(file, (error, buffer) => {
      if (error) {
        response.writeHead(404);
        response.end("Not found");
        return;
      }

      response.writeHead(200, {
        "Content-Type": types[path.extname(file)] || "application/octet-stream",
      });
      response.end(buffer);
    });
  })
  .listen(port, "127.0.0.1", () => {
    console.log(`Cronòmetre La Tremenda: http://127.0.0.1:${port}`);
  });
