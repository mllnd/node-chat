$('#chat-message-form').submit(function(event) {
    var socket = io();
    var message = $('input[name="message"]').val();
    event.preventDefault();
    if (message.length > 0) {
        socket.emit('chat-message', $('input[name="message"]').val());
        $('input[name="message"]').val('');
    }
});
$('#nickname-form').submit(function(event) {
    var socket = io();
    var nickname = $('input[name="nickname"]').val();
    event.preventDefault();
    if (nickname.length > 0) {
        $('input[name="nickname"]').attr('disabled', 'disabled');
        animate('.nickname-input-wrapper', 'fadeOutUp', function() {
            $('.nickname-input').hide();
            $('.chat-cover').fadeIn();
        })
        // $('input[name="nickname"]').val('');
    }
});
socket.on('chat-message', function(message) {
    $wrapper = $('#chat-wrapper');
    var div = $('<div>', {class: 'chat-entry'}).append($('<span>', {class: 'chat-entry-text'}).text(message));
    $('#chat').append(div);
    $wrapper.animate({scrollTop: $wrapper[0].scrollHeight}, 'slow');
});

function animate(element, animationName, callback) {
    const node = document.querySelector(element)
    node.classList.add('animated', animationName)
    function handleAnimationEnd() {
        node.classList.remove('animated', animationName)
        node.removeEventListener('animationend', handleAnimationEnd)
        if (typeof callback === 'function') callback()
    }
    node.addEventListener('animationend', handleAnimationEnd)
}