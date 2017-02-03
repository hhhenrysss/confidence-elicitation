survey = { questions: undefined,
           firstQuestionDisplayed: -1,
           lastQuestionDisplayed: -1};

////////////////////////////////////////////////////////////////////////////////////
// Survey Class
////////////////////////////////////////////////////////////////////////////////////
(function (survey, $) {

    survey.setup_survey = function(questions) {
        var self = this;
        var slider_value = [];

        this.questions = questions;

        this.questions.forEach(function(question) {
            self.generateQuestionElement( question );
        });

      
        $('#nextBtn').click(function() {
            var ok = true;

            // Store the slider value
            slider_value.push($('#slider').slider('value'));

            // Move the slider back to 0
            $("#slider").slider("value",  $("#slider").slider("option", "min"));

            for (i = self.firstQuestionDisplayed; i <= self.lastQuestionDisplayed; i++) {
                if (self.questions[i]['required'] === true && !self.getQuestionAnswer(questions[i])) {
                    $('.question-container > div.question:nth-child(' + (i+1) + ') > .required-message').show();
                    ok = false;
                }
            }
            if (!ok)
                return

            if ( $('#nextBtn').text().indexOf('Continue') === 0 ) {
                self.showNextQuestionSet();

            }
            else {

                var answers = {res: $(window).width() + "x" + $(window).height()};
                for (i = 0; i < self.questions.length; i++) {
                    answers[self.questions[i].id] = [self.getQuestionAnswer(self.questions[i]), slider_value[i]];
                }

                // Write answer to file (Note: Only works for Chrome | Not Safari)
                self.saveAnswers(JSON.stringify(answers), 'solution.json');
                self.hideAllQuestions();
                $("#slider").hide();
                $('#nextBtn').hide();
                $('.completed-message').text('Thank you for participating in this study! Your answers have been saved.');
                /*
                 // USE THIS TO WRITE TO A SERVER
                $.ajax({type: 'post',
                        url: 'http://localhost:8000',
                        contentType: "application/json",
                        data: JSON.stringify(answers),
                        processData: false,
                        success: function(response) {
                            self.hideAllQuestions();
                            $('#nextBtn').hide();
                            if ('success' in response) {
                                $('.completed-message').html('Thank you for participating in this study!<br><br>'+response['success']);
                            }
                            else if ('error' in response) {
                                $('.completed-message').text('An error occurred: '+response['error']);
                            }
                            else {
                                $('.completed-message').text('An unknown error occurred.');
                            }
                        },
                        error: function(response) {
                            self.hideAllQuestions();
                            $('#nextBtn').hide();
                            $('.completed-message').text('An error occurred: could not send data to server!');
                        }
                });*/
            }
        });
      
        this.showNextQuestionSet();
    }

    survey.saveAnswers = function (text, filename){
        var a = document.createElement('a');
        a.setAttribute('href', 'data:text/plain;charset=utf-u,' + encodeURIComponent(text));
        a.setAttribute('download', filename);
        a.click()
    }

    survey.getQuestionAnswer = function(question) {
        var result;

        if ( question.type === 'single-select' ) {
            result = $('input[type="radio"][name="' + question.id + '"]:checked').val() ;
        }
        else if ( question.type === 'single-select-oneline' ) {
            result = $('input[type="radio"][name="' + question.id + '"]:checked').val();
        }
        else if ( question.type === 'text-field-small' ) {
            result = $('input[name=' + question.id + ']').val();
        }
        return result ? result : undefined;
    }

    // Display the question
    survey.generateQuestionElement = function(question) {
        var questionElement = $('<div id="' + question.id + '" class="question"></div>');
        var questionTextElement = $('<div class="question-text"></div>');
        var questionAnswerElement = $('<div class="answer"></div>');
        var questionCommentElement = $('<div class="comment"></div>');
        questionElement.appendTo($('.question-container'));
        questionElement.append(questionTextElement);
        questionElement.append(questionAnswerElement);
        questionElement.append(questionCommentElement);
        questionTextElement.html(question.text);
        questionCommentElement.html(question.comment);
        if ( question.type === 'single-select' ) {
            questionElement.addClass('single-select');
            question.options.forEach(function(option) {
                questionAnswerElement.append('<label class="radio"><input type="radio" value="' + option + '" name="' + question.id + '"/>' + option + '</label>');
            });
        }
        else if ( question.type === 'text-field-small' ) {
            // No slider for this
            questionElement.addClass('text-field-small');
            questionAnswerElement.append('<input type="text" value="" class="text" name="' + question.id + '">');
        }
        else if ( question.type === 'single-select-oneline' ) {
            questionElement.addClass('single-select-oneline');
            var html = '<table border="0" cellpadding="5" cellspacing="0"><tr><td></td>';
            question.options.forEach(function(label) {
                html += '<td><label>' + label + '</label></td>';
            });
            html += '<td></td></tr><tr><td><div>' + question.labels[0] + '</div></td>';
            question.options.forEach(function(label) {
                html += '<td><div><input type="radio" value="' + label + '" name="' + question.id + '"></div></td>';
            });
            html += '<td><div>' + question.labels[1] + '</div></td></tr></table>';
            questionAnswerElement.append(html);
        }
        if ( question.required === true ) {
            var last = questionTextElement.find(':last');
            (last.length ? last : questionTextElement).append('<span class="required-asterisk" aria-hidden="true">*</span>');
        }
        questionAnswerElement.after('<div class="required-message">Please select an answer before continuing.</div>');
        questionElement.hide();
    }

    survey.hideAllQuestions = function() {
        $('.question:visible').each(function(index, element){
            $(element).hide();
        });
        $('.required-message').each(function(index, element){
            $(element).hide();
        });
    }

    survey.showNextQuestionSet = function() {
        this.hideAllQuestions();
        this.firstQuestionDisplayed = this.lastQuestionDisplayed+1;
      
        do {
            this.lastQuestionDisplayed++;  
            $('.question-container > div.question:nth-child(' + (this.lastQuestionDisplayed+1) + ')').show();
            if ( this.questions[this.lastQuestionDisplayed]['break_after'] === true)
                break;
        } while ( this.lastQuestionDisplayed < this.questions.length-1 );

        this.doButtonStates();
    }

    survey.showPreviousQuestionSet = function() {
        this.hideAllQuestions();
        this.lastQuestionDisplayed = this.firstQuestionDisplayed-1;
      
        do {
            this.firstQuestionDisplayed--;  
            $('.question-container > div.question:nth-child(' + (this.firstQuestionDisplayed+1) + ')').show();
            if ( this.firstQuestionDisplayed > 0 && this.questions[this.firstQuestionDisplayed-1]['break_after'] === true)
                break;
        } while ( this.firstQuestionDisplayed > 0 );
      
        this.doButtonStates();
    }

    survey.doButtonStates = function() {
        if ( this.lastQuestionDisplayed == this.questions.length-1 ) {
            $('#nextBtn').text('Finish');
            $('#nextBtn').addClass('blue');  
        }
        else if ( $('#nextBtn').text() === 'Finish' ) {
            $('#nextBtn').text('Continue »'); 
            $('#nextBtn').removeClass('blue');
        }
    }
})(survey, jQuery);


$(document).ready(function(){
    $.getJSON('questions.json', function(json) {
        survey.setup_survey(json);        
    });
});

window.onbeforeunload = function() {
    return "This will reset all answers that you've already filled in!";
}

////////////////////////////////////////////////////////////////////////////////////
// REGULAR SLIDER
////////////////////////////////////////////////////////////////////////////////////
$( function() {
    var handle = $("#custom-handle");

    $( "#slider" ).slider({
        range: "min",
        value: 50,
        min: 50,
        max: 100,
        animate: true,
        create: function() {
            setSliderTicks(event.target);
            handle.text( $( this ).slider( "value" ) );
        },
        slide: function( event, ui ) {
            handle.text( ui.value );
        }
    });
} );

function setSliderTicks(el) {
    var $slider =  $(el);
    var max =  $slider.slider("option", "max");
    var min =  $slider.slider("option", "min");
    var spacing =  100 / (max - min);

    $slider.find('.ui-slider-tick-mark').remove();
    for (var i = 0; i < max-min ; i++) {
        $('<span class="ui-slider-tick-mark"></span>').css('left', (spacing * i) +  '%').appendTo($slider);
    }
};
