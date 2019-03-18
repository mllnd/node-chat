var http = require('http');
var express = require('express'), app = module.exports.app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var port = 3000;

// Serve files from public folder
app.use(express.static('public'))

io.on('connection', function(socket) {
    socket.on('chat-message', function(message) {
        io.emit('chat-message', message);
        // console.log('Message: '+message);
    });
});

server.listen(port, () => console.log('Starting chat app on port '+port+'!'));