import pug from "pug";
import http from "http";

const compiledHTML = pug.compileFile("static/template.pug");
const honeypotPorts = [80, 443, 3000, 3030, 3333, 4000, 4040, 4444, 5000, 5050, 5555, 8000, 8080, 8888];

const server = http.createServer((req, res) => {
  if (req.url == "/favicon.ico") {
    return res.end("BUN");
  }
  console.log(`[@] \x1b[32m${req.method}\x1b[0m \x1b[37m${req.url}\x1b[0m: ${req.socket.remoteAddress}`);

  if (req.url == "/submit" && req.method == "POST") {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });

    return req.on("end", () => {
      // parse form data
      const form = new URLSearchParams(data);
      console.log('------------------------------------');
      console.log(form.get("name") + " : " + form.get("secret"));
      console.log('------------------------------------');

      res.writeHead(200, {
        "content-type": "application/json",
        "cache-control": "max-age=0, no-cache, no-store, must-revalidate",
        "pragma": "no-cache",
        "expires": "0",
      });

      return res.end(JSON.stringify({ status: "success" }));
    });
  }

  if (req.url == "/") {
    const html = compiledHTML({
      title: "Welcome abroad v1s1t0r",
      userIP: req.socket.remoteAddress,
      userPort: req.socket.remotePort,
    });
    res.writeHead(200, {
      "content-type": "text/html",
      "cache-control": "max-age=0, no-cache, no-store, must-revalidate",
      "pragma": "no-cache",
      "expires": "0",
    });

    return res.end(html);
  }

  res.statusCode = 404;
  return res.end("Yeah bro stop dir busting its' nothing here :)");
});

server.setMaxListeners(20);
for (const ports of honeypotPorts) {
  server.listen(ports, "0.0.0.0", () => {
    console.log(`[+] Server started listening on port \x1b[33m${ports}\x1b[0m`);
  });
}
