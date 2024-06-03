const http = require('http');

const host = 'localhost';
const port = 3000;

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('<h1>Hello World</h1>');
});

server.listen(port, host, () => {
    console.log('server is running on port 3000');
});