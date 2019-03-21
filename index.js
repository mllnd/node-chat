var http = require('http');
var express = require('express'), app = module.exports.app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var port = 3000;

// Serve files from public folder
app.use(express.static('public'));

var user_count = 0;
var user_list = [];

app.get('/users', function(request, response) {
    response.send(user_list);
});

io.on('connection', function(socket) {
    var connected_user = false;
    socket.on('chat-message', function(message) {
        io.emit('chat-message', message);
        // console.log('Message: '+message);
    });
    socket.on('user-join', function(nickname) {
        if (connected_user) return;
        socket.nickname = nickname;
        ++user_count;
        user_list.push(nickname);
        connected_user = true;
        io.emit('user-login', {
            'nickname': nickname,
            'user_count': user_list.length
        });
    });
    socket.on('disconnect', function() {
        if (connected_user) {
            --user_count;
            connected_user = false;
            user_list.splice(user_list.indexOf(socket.nickname), 1);
            io.emit('user-logout', {
                'nickname': socket.nickname,
                'user_count': user_list.length
            });
        }
    })
});

server.listen(port, () => console.log('Starting chat app on port '+port+'!'));