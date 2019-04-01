var http = require('http');
var express = require('express'), app = module.exports.app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var port = 3000;

// Serve files from public folder
app.use(express.static('public'));

var user_list = [];

app.get('/users', function(request, response) {
    response.send(user_list);
});

io.on('connection', function(socket) {
    var connected_user = false;
    socket.on('user-join', function(nickname) {
        if (connected_user) return;
        if (user_list.indexOf(nickname) > -1) {
            socket.emit('chat-error', 'Nickname already taken!');
            return;
        } else {
            socket.nickname = nickname;
            user_list.push(nickname);
            connected_user = true;
            io.emit('user-login', nickname);
        }
    });
    socket.on('chat-message', function(message) {
        io.emit('chat-message', {
            message: message,
            nickname: socket.nickname
        });
        // console.log('Message: '+message);
    });

    socket.on('typing-client', function(typing) {
        io.emit('typing', {nickname: socket.nickname, typing: typing});
        console.log(socket.nickname+' is typing a message...');
    });

    socket.on('disconnect', function() {
        if (connected_user) {
            connected_user = false;
            user_list.splice(user_list.indexOf(socket.nickname), 1);
            io.emit('user-logout', socket.nickname);
        }
    })
});

server.listen(port, () => console.log('Starting chat app on port '+port+'!'));