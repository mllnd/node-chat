$(function() {
    // Initialize variables
    var user_list = [];
    var socket = io();
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
            $('input[name="nickname"]').attr('disabled', 'disabled');
            socket.emit('user-join', nickname);
            animate('.nickname-input-wrapper', 'fadeOutUp', function() {
                $('.nickname-input').hide();
                $('.chat-cover').fadeIn();
                getUsers();
            })
            // $('input[name="nickname"]').val('');
        }
    });

    socket.on('user-login', function(nickname) {
        if ($.inArray(nickname, user_list) == -1) {
            user_list.push(nickname);
            var li = $('<li>', {nickname: nickname}).append($('<a>', {href: '#'}).text(nickname));
            $('.nav.user-list').append(li);
            $('#user-count').text(user_list.length);
        }
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