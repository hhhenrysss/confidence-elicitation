survey = { questions: undefined,
           firstQuestionDisplayed: -1,
           lastQuestionDisplayed: -1};

////////////////////////////////////////////////////////////////////////////////////
// Survey Class
////////////////////////////////////////////////////////////////////////////////////
(function (survey, $) {

    survey.setup_survey = function(questions) {
        var self = this;

        // Initialize needed computations
        var slider_value = [0];
        var testBank = ["I understand and agree with the instructions above.", "Yes", "No", "Yes", "No", "Yes", "No", "Yes", "No"]; // Read the testBank here (TODO: pass from csv)
        var currentBalance = 12; // Starting bank balance
        var moneyBank = ['Earnings from Previous Round', 0];
        var questionCounter = 0; // Keeps track of what question we are currently
        var nextClick = 0; // Count number of time the button next is clicked; used to determine the breaks
        var brier = 0;

        this.questions = questions;

        this.questions.forEach(function(question) {
            self.generateQuestionElement( question );
        });

        $('#nextBtn').click(function() {

            var subjectID = self.getQuestionAnswer(self.questions[0]);
            var questionID = self.questions[questionCounter]['id'];
            var group = self.getQuestionAnswer(self.questions[1]);
            var ok = true;

            //console.log("question ID:" + self.questions[questionCounter]['id']);
            console.log("Question Counter:" + questionCounter);
            //console.log("nextClick value:" + nextClick);
            //console.log("SubjectID: " + self.getQuestionAnswer(self.questions[0]))
            //console.log("Group: " + self.getQuestionAnswer(self.questions[1]))

            //console.log("currentBalance:" + currentBalance);
            console.log("moneyBank:" + moneyBank);

            if (questionID == 0 && questionCounter == 1) {

                // Instruction given will depend on the group
                if (group == "Group 1: SL, NB") {
                    document.getElementById('instructions').innerHTML = "<font size=\"4\"><b>INSTRUCTIONS</b>: In this study, you will be asked " +
                        "\"Yes-No\" type of questions on a variety of topics. For each question, you will also be asked to " +
                        "quantify your conviction using a horizontal slider as shown below. <br><br> " +
                        "<img src=\"\\image\\hslider.png\" align=\"middle\"> " +
                        "<br><br>You will receive $10 for your participation, regardless of how " +
                        "you perform in the experiment. You will have a chance to earn more money based on how many " +
                        "questions you can answer correctly.<br></font>";
                } else if (group == "Group 2: SL, B") {
                    document.getElementById('instructions').innerHTML = "<font size=\"4\"><b>INSTRUCTIONS</b>: In this study, you will be asked " +
                        "\"Yes-No\" type of questions on a variety of topics. For each question, you will also be asked to " +
                        "quantify your conviction using a horizontal slider as shown below. <br><br> " +
                        "<img src=\"\\image\\hslider.png\" align=\"middle\"> " +
                        "<br>You will receive $10 for your participation, regardless of how " +
                        "you perform in the experiment. You will have a chance to earn more money based on how many " +
                        "questions you can answer correctly.<br><br>" +
                        "There will be a virtual bank starting at $12 which " +
                        "increases or decreases depending on your answer and your conviction for each question. " +
                        "Note, the bank will never go below zero.<br></font>";
                } else if (group == "Group 3: PS, NB") {
                    document.getElementById('instructions').innerHTML = "<font size=\"4\"><b>INSTRUCTIONS</b>: In this study, you will be asked " +
                    "\"Yes-No\" type of questions on a variety of topics. For each question, you will also be asked to " +
                    "quantify your conviction using a parabolic slider as shown below. <br><br> You will receive $10 for your participation, regardless of how " +
                    "you perform in the experiment. You will have a chance to earn more money based on how many " +
                    "questions you can answer correctly.<br></font>";
                } else if (group == "Group 4: PS, B") {
                    document.getElementById('instructions').innerHTML = "<font size=\"4\"><b>INSTRUCTIONS</b>: In this study, you will be asked " +
                        "\"Yes-No\" type of questions on a variety of topics. For each question, you will also be asked to " +
                        "quantify your conviction using a parabolic slider as shown below. <br><br> You will receive $10 for your participation, regardless of how " +
                        "you perform in the experiment. You will have a chance to earn more money based on how many " +
                        "questions you can answer correctly.<br><br> There will be a virtual bank starting at $12 which " +
                        "increases or decreases depending on your answer and your conviction for each question. " +
                        "Note, the bank will never go below zero.<br></font>";
                }

            }
            else if (questionCounter > 1) {

                // Turn on the slider and its label and get rid of instruction
                $("#slider").show();
                document.getElementById("slider-label").style.display = "inline";
                document.getElementById('instructions').innerHTML = "";
            }

            // Make question required and display message
            for (i = self.firstQuestionDisplayed; i <= self.lastQuestionDisplayed; i++) {
                if (self.questions[i]['required'] === true && !self.getQuestionAnswer(questions[i])) {
                    $('.question-container > div.question:nth-child(' + (i+1) + ') > .required-message').show();
                    ok = false;
                }
            }

            // Do nothing if no answer is selected
            if (!ok)
                return

            // If button is clicked and answer is selected
            if ( $('#nextBtn').text().indexOf('Continue') === 0) {

                // Every n question, show the bank and take a break
                // TODO: Make continue button appears after 60 seconds
                if (nextClick % 2 == 0 && nextClick != 0 && questionID != 0) {

                    // Push the last calculation | TODO: Incorrect, fix this
                    moneyBank.push(Number(brier.toFixed(2)));

                    // Hide the question and slider
                    self.hideAllQuestions();
                    $("#slider").hide();
                    document.getElementById("slider-label").style.display = "none";

                    // Plot the current moneyBank
                    self.getBank(moneyBank);
                    $("#chart").show();

                    // Tell them to take a break
                    document.getElementById('message').innerHTML="Please take a 1 minute break and review your " +
                            "current earnings is shown in the chart below.<br><br>Your current bank balance is: $" +
                            currentBalance;

                    console.log("BREAK QUESTION!");

                    // Reset the iterator
                    nextClick = 0;

                    // Reset the bank for new round
                    moneyBank = ['Earnings from Previous Round', 0];
                }
                else {

                    // Store the slider value
                    slider_value.push($('#slider').slider('value'));

                    // Move the slider back to 0
                    $("#slider").slider("value",  $("#slider").slider("option", "min"));

                    // TODO: change text back to 0
                    // Compute Brier Score and get bank balance (use simply calculation for now)
                    // TODO: INCORRECT: need to fix this
                    // TODO: Verify Brier calculation; Make this part into a function
                    if (questionCounter > 1 && questionID != 0) {
                        // If correct answer
                        console.log(self.questions[questionCounter]['text']);
                        console.log(self.getQuestionAnswer(self.questions[questionCounter]));
                        console.log(testBank[questionCounter]);

                        if(self.getQuestionAnswer(self.questions[questionCounter]) === testBank[questionCounter]) {
                            //brier = Math.pow(((slider_value[questionCounter]*0.01)-1),2);
                            brier = slider_value[questionCounter]*0.01;
                            currentBalance += brier;
                        }
                        // If incorrect answer
                        else {
                            //brier = Math.pow(((slider_value[questionCounter]*0.01)-1),2);
                            brier = -slider_value[questionCounter]*0.01;
                            currentBalance += brier;
                        }
                        moneyBank.push(Number(brier.toFixed(2)));

                    }

                    // Increase the question index and click counter
                    nextClick += 1;
                    questionCounter += 1;

                    document.getElementById('message').innerHTML="";
                    self.showNextQuestionSet();
                    $("#chart").hide();
                }
            }

            // This is for the final question
            else {

                // Store the slider value
                slider_value.push($('#slider').slider('value'));

                // Compute Brier Score and get bank balance (use simply calculation for now)
                // TODO: Verify Brier calculation; Make this part into a function
                if (questionCounter > 1) {
                    // If correct answer
                    if(self.getQuestionAnswer(self.questions[questionCounter]) === testBank[questionCounter]) {
                        //brier = Math.pow(((slider_value[questionCounter]*0.01)-1),2);
                        brier = slider_value[questionCounter]*0.01;
                        currentBalance += brier;
                        moneyBank.push(Number(brier.toFixed(2)));
                    }
                    // If incorrect answer
                    else {
                        //brier = Math.pow(((slider_value[questionCounter]*0.01)-1),2);
                        brier = -slider_value[questionCounter]*0.01;
                        currentBalance += brier;
                        moneyBank.push(Number(brier.toFixed(2)));

                    }
                }

                nextClick += 1;

                // Plot the current moneyBank
                self.getBank(moneyBank);

                // Get all of the answers to save
                var answers = {moneyEarned: money};
                for (i = 0; i < self.questions.length; i++) {
                    answers[self.questions[i].id] = [self.getQuestionAnswer(self.questions[i]), slider_value[i]];
                }

                // Write answer to file (Note: Only works for Chrome | Not Safari)
                self.saveAnswers(JSON.stringify(answers), String(subjectID) + '.json');
                self.hideAllQuestions();
                $("#chart").show();
                $("#slider").hide();
                $('#nextBtn').hide();
                document.getElementById("slider-label").style.display = "none";
                $('.completed-message').text("Thank you for participating in this study! Your answers have been saved.\n You've earned: $" + money.toFixed(2) + "!");

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

    // Function to get the answers to the radio buttom questions
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

    // Function to the question
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
            // No slider for these types of questions
            $("#slider").hide();
            document.getElementById("slider-label").style.display = 'none';
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
        // If the question is marked as required, do not allow the user to continue
        if ( question.required === true ) {
            var last = questionTextElement.find(':last');
            (last.length ? last : questionTextElement).append('<span class="required-asterisk" aria-hidden="true">*</span>');
        }
        questionAnswerElement.after('<div class="required-message">Please select an answer before continuing.</div>');
        questionElement.hide();
    }

    // Function to hide question when we've reached the last page
    survey.hideAllQuestions = function() {
        $('.question:visible').each(function(index, element){
            $(element).hide();
        });
        $('.required-message').each(function(index, element){
            $(element).hide();
        });
    }

    // Function to get the next question
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

    // Function to get the previous question
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

    // Create the buttons for the survey
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

    // Display the question
    survey.generateBankElement = function(question) {
        var questionElement = $('<div id="bank" class="question"></div>');
        var questionTextElement = $('<div class="question-text"></div>');
        var questionAnswerElement = $('<div class="answer"></div>');
        var questionCommentElement = $('<div class="comment"></div>');
        questionElement.appendTo($('.question-container'));
        questionElement.append(questionTextElement);
        questionElement.append(questionAnswerElement);
        questionElement.append(questionCommentElement);
        questionTextElement.html(question.text);
        questionCommentElement.html(question.comment);
        questionElement.hide();
    }

    //////////////////////////////////////////////////////////////////////////////////////////
    // Utility Functions
    //////////////////////////////////////////////////////////////////////////////////////////

    // Use to get the answers and save to file locally
    survey.saveAnswers = function (text, filename){
        var a = document.createElement('a');
        a.setAttribute('href', 'data:text/plain;charset=utf-u,' + encodeURIComponent(text));
        a.setAttribute('download', filename);
        a.click()
    }

    survey.getBank = function (moneyBank) {
        var chart = c3.generate({
            size: {
                height: 240,
                width: 480
            },
            data: {
                columns: [
                    moneyBank,
                    ['Reference Line',0,0,0,0,0,0,0,0,0,0]
                ],
                type: 'bar',
                types: {
                        'Reference Line': 'line',
                },
                colors: {
                    'Earnings from Previous Round': function(d) { return d.value < 0 ? '#E57F7F' : '#99EA99' }
                }
            },
            legend: {
                show: false
            },
            axis: {
                y: {
                    max: 1,
                    min: -1,
                    // Range includes padding, set 0 if no padding needed
                    // padding: {top:0, bottom:0}
                }
            },
            bar: {
                width: {
                    ratio: 0.3 // this makes bar width 50% of length between ticks
                }
            }
        });
    }

})(survey, jQuery); // End class

//////////////////////////////////////////////////////////////////////////////////////////
// LOAD IN THE QUESTIONS (TODO: Read CSV into JSON makes life easier)
//////////////////////////////////////////////////////////////////////////////////////////

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
        step: 1,
        animate: true,
        create: function() {
            handle.text( $( this ).slider( "value" ) );
        },
        slide: function( event, ui ) {
            handle.text( ui.value );
        }
    });
} );

