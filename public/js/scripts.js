$('#chat-message-form').submit(function(event) {
    var socket = io();
    var message = $('input[name="message"]').val();
    event.preventDefault();
    if (message.length > 0) {
        socket.emit('chat-message', $('input[name="message"]').val());
        $('input[name="message"]').val('');
    }
});
socket.on('chat-message', function(message) {
    $wrapper = $('#chat-wrapper');
    var div = $('<div>', {class: 'chat-entry'}).append($('<span>', {class: 'chat-entry-text'}).text(message));
    $('#chat').append(div);
    $wrapper.animate({scrollTop: $wrapper[0].scrollHeight}, 'slow');
});