$(function () {
    // fetch questions first as ajax is asynchronous
    $('.graph').append('<div class="temporary_loading_container"><div class="loading"></div></div>');
    utils.load_questions(survey.start);
    window.onbeforeunload = function() {
        return "This will reset all answers that you've already filled in!";
    };
});