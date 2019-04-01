$(function() {
    // Initialize variables
    var user_list = [];
    var socket = io();
    var typing = false;
    var timeout;
    var client_nickname;

    // Set the user count
    $('#user-count').text(user_list.length);

    $('#chat-message-form').submit(function(event) {
        var message = $('input[name="message"]').val();
        event.preventDefault();
        if (message.length > 0) {
            socket.emit('chat-message', message);
            $('input[name="message"]').val('');
        }
    });

    $('#nickname-form').submit(function(event) {
        var nickname = $('input[name="nickname"]').val();
        event.preventDefault();
        if (nickname.length > 0) {
            client_nickname = nickname;
            socket.emit('user-join', nickname);
        }
    });

    function timeoutCallback() {
        typing = false;
        socket.emit('typing-client', false);
    }

    $('input[name="message"]').keyup(function() {
        typing = true;
        socket.emit('typing-client', true);
        clearTimeout(timeout);
        timeout = setTimeout(timeoutCallback, 2000);
    });

    socket.on('typing', function(data) {
        var nickname_object = $('.nav.user-list li[nickname="'+data.nickname+'"]');
        if (data.typing && nickname_object.find('i').length == 0) {
            nickname_object.attr('typing', true);
            nickname_object.find('a').append('<i style="margin-left: 5px;" class="blinking fa fa-keyboard-o"></i>');
        } else {
            nickname_object.attr('typing', false);
            nickname_object.find('i').remove();
        }
    });

    socket.on('user-login', function(nickname) {
        if (client_nickname == nickname) {
            animate('.nickname-input-wrapper', 'fadeOutUp', function() {
                $('input[name="nickname"]').attr('disabled', 'disabled');
                $('.nickname-input').hide();
                $('.chat-cover').fadeIn();
            })
        }
        getUsers();
        if ($.inArray(nickname, user_list) == -1) {
            user_list.push(nickname);
            var li = $('<li>', {nickname: nickname}).append($('<a>', {href: '#'}).text(nickname));
            $('.nav.user-list').append(li);
            $('#user-count').text(user_list.length);
        }
    });

    socket.on('chat-error', function(message) {
        alert(message);
    });

    socket.on('user-logout', function(nickname) {
        user_list.splice(user_list.indexOf(nickname), 1);
        $('#user-count').text(user_list.length);
        $('.nav.user-list li[nickname="'+nickname+'"]').remove();
    })

    socket.on('chat-message', function(data) {
        $wrapper = $('#chat-wrapper');
        var div = $('<div>', {class: 'chat-entry'});
        div.append($('<span>', {class: 'chat-entry-user'}).html('<b>'+data.nickname+'</b>'));
        div.append($('<br>'));
        div.append($('<span>', {class: 'chat-entry-text'}).text(data.message));
        $('#chat').append(div);
        $wrapper.animate({scrollTop: $wrapper[0].scrollHeight}, 'slow');
    });

    function getUsers() {
        $.get('/users', function(data) {
            if (data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    // Check if user already exists in local user list
                    if ($.inArray(data[i], user_list) == -1) {
                        user_list.push(data[i]);
                        var li = $('<li>', {nickname: data[i]}).append($('<a>', {href: '#'}).text(data[i]));
                        $('.nav.user-list').append(li);
                        $('#user-count').text(user_list.length);
                    }
                }
            }
        });
    }

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
});