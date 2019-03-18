var http = require('http');
var express = require('express'), app = module.exports.app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var port = 3000;

// Serve files from public folder
app.use(express.static('public'))

app.listen(port, () => console.log('Starting chat app on port '+port+'!'));