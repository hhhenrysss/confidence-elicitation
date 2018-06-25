$(function () {
    // fetch questions first as ajax is asynchronous
    utils.load_questions(survey.start);
    window.onbeforeunload = function() {
        return "This will reset all answers that you've already filled in!";
    };
});