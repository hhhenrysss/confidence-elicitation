function timer(time, callback) {
    /*
    This function generates a timer and when time's up disappears
     */
    $('#message').append('<div class="temporary_loading_container"><div class="loading"></div></div>');

    setTimeout(function () {
        $('.temporary_loading_container').remove();
        callback();
    }, time)
}


