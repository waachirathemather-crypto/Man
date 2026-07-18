import { createReadStream, existsSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";

const root = process.cwd();
const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
};

createServer((request, response) => {
  const requestPath = new URL(request.url, "http://localhost").pathname;
  const requestedFile = requestPath === "/" ? "index.html" : requestPath.slice(1);
  const file = normalize(join(root, requestedFile));
  const insideRoot = file.startsWith(root);
  const target = insideRoot && existsSync(file) ? file : join(root, "index.html");

  response.writeHead(200, {
    "Content-Type": contentTypes[extname(target)] ?? "application/octet-stream",
    "Cache-Control": target.endsWith("index.html") ? "no-cache" : "public, max-age=31536000, immutable",
  });
  createReadStream(target).pipe(response);
}).listen(process.env.PORT || 3000, "0.0.0.0");
