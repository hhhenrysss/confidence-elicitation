survey = {
    questions: undefined,
    firstQuestionDisplayed: -1,
    lastQuestionDisplayed: -1
};

////////////////////////////////////////////////////////////////////////////////////
// Survey Class
////////////////////////////////////////////////////////////////////////////////////

// To-Do: IT IS REALLY IMPORTANT THAT THE EXPERIMENTER ENTERS THE SUBJECTID AND GROUP
// BEFORE CLICKING CONTINUE. ELSE, YOU WILL RUN INTO AN ERROR!

//global variable
//
//
var coords=[50,0];
var handle1 = [{
    x: 0,
    y: 0
}];
var margin = {
        top: 20,
        right: 20,
        bottom: 30,
        left: 50
    },
width = 200 - margin.left - margin.right,
height = 440 - margin.top - margin.bottom;
var svg;
var container;
var drag;
var handle_circle;
var hor;
var ver;

var clicked = false;


(function (survey, $) {

    survey.setup_survey = function(questions) {
        var self = this;

        // Initialize needed computations
        var slider_value = []; // Use between rounds
        var sliderBank = [0,0,0,0,0,0,0]; // Use to output
        var currentBalance = 12; // Starting bank balance
        var moneyBank = ['Earnings from Previous Round'];
        var questionCounter = 0; // Keeps track of what question we are currently
        var nextClick = 0; // Count number of time the button next is clicked; used to determine the breaks
        var answerBank = [];// Store responses for each question; used to get userID and group
        var outputAnswer = [0,0,0,0,0]; // Use to get the output file with the user answers
        var roundUserAnswer = [];//stores users' answers
        var roundAnswer = [];//stores standard answers
        var startTime = new Date();
        var timeBank = [0,0,0,0,0,0,0];

        // Read in the appropriate test bank
        testBank = getTestBank("answer_subjective_UPDATED");

        this.questions = questions;

        this.questions.forEach(function(question) {//create DOM structure for each question
            self.generateQuestionElement( question );
        });

        $('#nextBtn').click(function() {
            var subjectID = self.getQuestionAnswer(self.questions[0]);
            var questionID = self.questions[questionCounter]['id'];
            var group =  self.getQuestionAnswer(self.questions[1]);
            var ok = true;

            answerBank.push(self.getQuestionAnswer(self.questions[questionCounter]));//stores standard answer of the current question

            console.log("Question Counter:" + questionCounter);
            console.log("QuestionID:" + questionID);

            // Make question required and display message
            for (i = self.firstQuestionDisplayed; i <= self.lastQuestionDisplayed; i++) {
                if (self.questions[i]['required'] === true && !self.getQuestionAnswer(questions[i])) {
                    $('.question-container > div.question:nth-child(' + (i+1) + ') > .required-message').show();
                    ok = false;

                    if (questionID == 0) {
                        location.reload();
                    }
                }
            }

            // Do nothing if no answer is selected
            if (!ok)
                return

            if (questionID == 0 && questionCounter == 1) {
                // Instruction given will depend on the group
                if (group == "Group 1: Linear Slider") {
                    document.getElementById('instructions').innerHTML = "<font size=\"4\"><b>INSTRUCTIONS</b> You will " +
                        "receive $12 for your participation in this experiment. This is yours to keep regardless of how " +
                        "you perform in the experiment.<br><br>You will also have a virtual bank which you will receive " +
                        "its cash value at the end of the experiment. The bank's initial balance is $12.<br><br>By " +
                        "answering each question, your reward or penalty from that question will increase or decrease " +
                        "your bank balance.<br><br>At the end of every 10 questions, you will receive a summary report of " +
                        "your earned reward/penalty in the most recent 10 questions as well as your overall bank balance " +
                        "up to that point of the experiment.<br><br>Your answers will determine your final bank balance. " +
                        "Correct answers will increase your bank balance from the initial $12, and incorrect answers " +
                        "will lower your bank balance, but the bank balance will never go below zero.<br></font>";
                } else if (group == "Group 2: Linear Slider, Feedback") {
                    document.getElementById('instructions').innerHTML = "<font size=\"4\"><b>INSTRUCTIONS</b> You will " +
                        "receive $12 for your participation in this experiment. This is yours to keep regardless of how " +
                        "you perform in the experiment.<br><br>You will also have a virtual bank which you will receive " +
                        "its cash value at the end of the experiment. The bank's initial balance is $12.<br><br>By " +
                        "answering each question, your reward or penalty from that question will increase or decrease " +
                        "your bank balance.<br><br>At the end of every 10 questions, you will receive a summary report of " +
                        "your earned reward/penalty in the most recent 10 questions as well as your overall bank balance " +
                        "up to that point of the experiment.<br><br>Your answers will determine your final bank balance. " +
                        "Correct answers will increase your bank balance from the initial $12, and incorrect answers " +
                        "will lower your bank balance, but the bank balance will never go below zero.<br></font>";
                } else if (group == "Group 2: Parabolic Slider") {
                    document.getElementById('instructions').innerHTML = "<font size=\"4\"><b>INSTRUCTIONS</b> You will " +
                        "receive $10 for your participation in this experiment. This is yours to keep regardless of how " +
                        "you perform in the experiment.<br><br>You will also have a virtual bank which you will receive " +
                        "its cash value at the end of the experiment. The bank's initial balance is $12.<br><br>By " +
                        "answering each question, your reward or penalty from that question will increase or decrease " +
                        "your bank balance.<br><br>At the end of every 10 questions, you will receive a summary report of " +
                        "your earned reward/penalty in the most recent 10 questions as well as your overall bank balance " +
                        "up to that point of the experiment.<br><br>Your answers will determine your final bank balance. " +
                        "Correct answers will increase your bank balance from the initial $12, and incorrect answers " +
                        "will lower your bank balance, but the bank balance will never go below zero.<br></font>";
                } else if (group == "Group 4: Parabolic Slider, Feedback") {
                    document.getElementById('instructions').innerHTML = "<font size=\"4\"><b>INSTRUCTIONS</b> You will " +
                        "receive $10 for your participation in this experiment. This is yours to keep regardless of how " +
                        "you perform in the experiment.<br><br>You will also have a virtual bank which you will receive " +
                        "its cash value at the end of the experiment. The bank's initial balance is $12.<br><br>By " +
                        "answering each question, your reward or penalty from that question will increase or decrease " +
                        "your bank balance.<br><br>At the end of every 10 questions, you will receive a summary report of " +
                        "your earned reward/penalty in the most recent 10 questions as well as your overall bank balance " +
                        "up to that point of the experiment.<br><br>Your answers will determine your final bank balance. " +
                        "Correct answers will increase your bank balance from the initial $12, and incorrect answers " +
                        "will lower your bank balance, but the bank balance will never go below zero.<br></font>";
                }
            } else if (questionCounter > 1) {

                group = answerBank[1];
                if (group == "Group 1: Linear Slider" || group == "Group 2: Linear Slider, Feedback") {
                    $("#slider").css('display','block'); // Show the regular slider
                    $('.ui-slider-handle').hide(); // Hide handle
                    d3.select("svg").remove(); // Destroy the parabolic slider

                    // Get rid of the instructions
                    document.getElementById("slider-label").style.display = "inline";
                    document.getElementById('instructions').innerHTML = "";

                    if (questionCounter == 2) {
                        outputAnswer.push(subjectID);
                        outputAnswer.push(group);

                        document.getElementById("slider-label").style.display = "inline"
                        document.getElementById('slider-label').innerHTML = "<b><h2>Part 2)</h2></b> What is the probability that " +
                            "you think your answer to Part 1 is correct? (Click anywhere on the bar so that the slider appears, then by moving " +
                            "the slider, specify your answer to Part 2)<br><br>";
                        document.getElementById('slider-instructions').innerHTML = "Based on your knowledge and experience, you " +
                            "may believe it is more likely that Donald Trump was over 40 when he became president, so choosing " +
                            "the \"Yes\" answer is more appropriate.<br><br>Since you have more tendency toward the \"Yes\", " +
                            "you don't stay at 50% and prefer to move the slider to the right of 50%. The stronger is your " +
                            "conviction that your answer is correct, the more you slide to the right.<br>";
                    } else if (questionCounter == 3) {
                        document.getElementById("slider-label").style.display = "inline"
                        document.getElementById('slider-label').innerHTML = "<b><h2>Part 2)</h2></b> What is the probability that " +
                            "you think your answer to Part 1 is correct? (Click anywhere on the bar so that the slider appears, then by moving " +
                            "the slider, specify your answer to Part 2)<br><br>";
                        document.getElementById('slider-instructions').innerHTML = "Based on your knowledge and experience, " +
                            "you may believe it is less likely that Bill Gates was one of the founders of Apple, so choosing " +
                            "the \“No\" answer is more appropriate.<br><br>Since you have more tendency toward the \“No\", " +
                            "you don't stay at 50% and prefer to move the slider to the right of 50%. The stronger is your " +
                            "conviction that your answer is correct, the more you slide to the right.<br>" ;
                    } else if (questionCounter == 4) {
                        document.getElementById("slider-label").style.display = "inline"
                        document.getElementById('slider-label').innerHTML = "<b><h2>Part 2)</h2></b> What is the probability that " +
                            "you think your answer to Part 1 is correct? (Click anywhere on the bar so that the slider appears, then by moving " +
                            "the slider, specify your answer to Part 2)<br><br>";
                        document.getElementById('slider-instructions').innerHTML = "Based on your knowledge and experience, " +
                            "you may believe it is more likely that a 5-10 adult is a male than female, so choosing the \"Yes\"" +
                            " answer is more appropriate.<br><br>Since you have more tendency toward the \"Yes\", you don't " +
                            "stay at 50% and prefer to move the slider to the right of 50%. The stronger is your conviction " +
                            "that your answer is correct, the more you slide to the right. But since you realize that there " +
                            "is still some chance that this adult may be female, it is not appropriate to move the slider all " +
                            "the way to 100%, therefore, a slider position somewhere between 50% and 100% is more appropriate.<br>";
                    } else if (questionCounter == 5) {
                        $("#slider").css('display','none');
                        document.getElementById('slider-instructions').innerHTML = "";
                        document.getElementById('slider-label').innerHTML = "";
                        document.getElementById('instructions').innerHTML = "<font size=\"4\">This completes the instructions " +
                            "for your task. If you have any questions, please feel free to share them with the experimenter before " +
                            "proceeding.<br><br>If you have no questions, then please click on the \"Continue\" button to begin performing " +
                            "the experimental task, for which you you will gain or lose money in your bank based on the accuracy of " +
                            "answering the questions and in adjusting the slider knob.<br></font>";
                        answerBank.splice(2); // Delete everything except the first two
                    } else {
                        document.getElementById('slider-instructions').innerHTML = ""
                        document.getElementById('slider-label').innerHTML = "What is the probability that " +
                            "you think your answer is correct?<br><br>";
                    }

                }
                else if (group == "Group 2: Parabolic Slider" || group == "Group 4: Parabolic Slider, Feedback"){

                    $("#slider").remove(); // Destroy the regular slider
                    parabolicSlider(); // Start the parabolic slider
                    d3.selectAll("svg").attr("display", "block"); // Make sure it is visible after the breaks

                    // Get rid of the instructions
                    document.getElementById("slider-label").style.display = "inline"
                    document.getElementById('slider-label').innerHTML = ""
                    document.getElementById('instructions').innerHTML = "";

                    if (questionCounter == 2) {
                        outputAnswer.push(subjectID);
                        outputAnswer.push(group);

                        document.getElementById('slider-instructions').innerHTML = "Based on your knowledge and experience, you " +
                            "may believe it is more likely that Donald Trump was over 40 when he became president, so choosing " +
                            "the \"Yes\" answer is more appropriate.<br><br>Since you have some evidence to support the \“Yes\” " +
                            "answer, it may be acceptable to move the slider all the way to the bottom of the curve.<br><br>The right " +
                            "place for the slider is somewhere in between where your belief about the likelihood of winning " +
                            "versus losing justifies the length of red and green bars at that point. The more you believe your " +
                            "answer is correct, the more you want to move towards the bottom.<br>";
                        document.getElementById("slider-label").style.display = "inline"
                        document.getElementById('slider-label').innerHTML = "<b><h2>Part 2)</h2></b> Click anywhere on the curve " +
                            "so that the slider appears, then by moving the slider, specify your answer to Part 2. As you move the " +
                            "slider on the curve, the green bar always shows how many points you will earn if your answer is correct. " +
                            "The red bar shows how many points you will lose if your answer is incorrect. Move the slider on the " +
                            "curve to a point where the relative sizes of the green and red bar represents what " +
                            "you are truly willing to gain or lose in case your answer is correct or incorrect.<br>";
                        resetHandle();
                    } else if (questionCounter == 3) {
                        document.getElementById('slider-instructions').innerHTML = "Based on your knowledge and experience, you " +
                            "may believe it is less likely that Bill Gates was one of the founders of Apple, so choosing the \“No\" " +
                            "answer is more appropriate.<br><br>Since you have some evidence to support the \“No\” answer, it may " +
                            "be acceptable to move the slider all the way to the bottom of the curve.<br><br>The right place for " +
                            "the slider is somewhere in between where your belief about the likelihood of winning versus losing " +
                            "justifies the length of red and green bars at that point. The more you believe your answer is correct, " +
                            "the more you want to move towards the bottom.<br><br>" ;
                        document.getElementById("slider-label").style.display = "inline"
                        document.getElementById('slider-label').innerHTML = "<b><h2>Part 2)</h2></b> Click anywhere on the curve " +
                            "so that the slider appears, then by moving the slider, specify your answer to Part 2. As you move the " +
                            "slider on the curve, the green bar always shows how many points you will earn if your answer is correct. " +
                            "The red bar shows how many points you will lose if your answer is incorrect. Move the slider on the " +
                            "curve to a point where the relative sizes of the green and red bar represents what " +
                            "you are truly willing to gain or lose in case your answer is correct or incorrect.<br>";
                        resetHandle();
                    } else if (questionCounter == 4) {
                        document.getElementById('slider-instructions').innerHTML = "Based on your knowledge and experience, you may " +
                            "believe it is more likely that a 5-10 adult is a male than female, so choosing the \"Yes\" answer is more " +
                            "appropriate.<br><br>Since you have some evidence to support the \“Yes\” answer, it is not acceptable to " +
                            "move the slider all the way to the bottom of the curve. But you are not completely sure that \“Yes\” " +
                            "is the correct answer, so it is not appropriate to move the slider all the way to the top of the " +
                            "curve either.<br><br>The right place for the slider is somewhere in between where your belief about " +
                            "the likelihood of winning versus losing justifies the length of red and green bars at that point. " +
                            "The more you believe your answer is correct, the more you want to move towards the bottom.<br>" ;
                        document.getElementById("slider-label").style.display = "inline"
                        document.getElementById('slider-label').innerHTML = "<b><h2>Part 2)</h2></b> Click anywhere on the curve " +
                            "so that the slider appears, then by moving the slider, specify your answer to Part 2. As you move the " +
                            "slider on the curve, the green bar always shows how many points you will earn if your answer is correct. " +
                            "The red bar shows how many points you will lose if your answer is incorrect. Move the slider on the " +
                            "curve to a point where the relative sizes of the green and red bar represents what " +
                            "you are truly willing to gain or lose in case your answer is correct or incorrect.<br>";
                        resetHandle();
                    } else if (questionCounter == 5) {
                        document.getElementById('slider-instructions').innerHTML = "";
                        document.getElementById('slider-label').innerHTML = "";
                        document.getElementById('instructions').innerHTML = "<font size=\"4\">This completes the instructions " +
                            "for your task. If you have any questions, please feel free to share them with the experimenter before " +
                            "proceeding.<br><br>If you have no questions, then please click on the \"Continue\" button to begin performing " +
                            "the experimental task, for which you you will gain or lose money in your bank based on the accuracy of " +
                            "answering the questions and in adjusting the slider knob.<br></font>";
                        d3.selectAll("svg").attr("display", "none");
                    } else {
                        document.getElementById('slider-instructions').innerHTML = ""
                        document.getElementById('slider-label').innerHTML = "";
                        resetHandle();
                    }
                }
            }

            // #####################
            // If button is clicked and answer is selected
            if ( $('#nextBtn').text().indexOf('Continue') === 0) {

                var endTime = new Date();
                var elapsed = endTime - startTime;
                startTime = new Date();

                if (questionID > 0 & nextClick != 0) {

                    if (group == "Group 3: Parabolic Slider, No Feedback" || group == "Group 4: Parabolic Slider, Feedback") {

                        //reset the slider and color bar
                        d3.select("#handle_circle").remove()
                        hor.attr("width", 0);
                        ver.attr("height", 0);
                        handle1 = [{
                            x: 0,
                            y: 0
                        }];
                        clicked=false;


                        // detect slider drag function of the slider
                        var drag = d3.behavior.drag()
                            .origin(function(d) { return d; })
                            .on("drag", dragged)
                        function dragged(d) {

                            coords = d3.mouse(this);
                            var cx = Math.min(Math.max(coords[0], 0), 140);
                            var cy = Math.min(Math.max(0.023  * cx * cx, 0), 440);
                            d3.select('g.dot circle')
                                .attr("cx", Math.min(cx, 130))
                                .attr("cy", Math.min(cy, 390));
                            hor.attr("width",Math.min(cx,width));
                            ver.attr("height", Math.min(cy,height));


                            var div = d3.select("body").select("#final")
                                .style("left", (d3.event.pageX - 100) + "px")
                                .style("top", (d3.event.pageY - 12) + "px");
                            // clicked=true;

                        }


                        handle_circle= container.append("g")
                            .attr("id","handle_circle")
                            .attr("class", "dot")
                            .attr("style", "display:none")
                            .selectAll('circle')
                            .data(handle1)
                            .enter().append("circle")
                            .attr("r", 3)
                            .attr("cx", function(d) { return d.x;})
                            .attr("cy", function(d) { return d.y;})
                            .call(drag);



                        //store the slider value, handle the extreme case
                        if (coords[0] <= 50) {
                            slider_value.push(0.5);
                            sliderBank.push(0.5);
                        }
                        else {
                            if (coords[0] > 180) {
                                slider_value.push(1);
                                sliderBank.push(1);
                            }
                            else {
                                slider_value.push(((coords[0]-50)/260+0.5));
                                sliderBank.push(((coords[0]-50)/260+0.5));
                            }
                        }
                        //reset slider value
                        coords[0]=50;

                        timeBank.push(elapsed)
                    }
                    else {
                        slider_value.push($('#slider').slider('value')/100);
                        sliderBank.push($('#slider').slider('value')/100);
                        timeBank.push(elapsed)
                    }

                    console.log("SliderValue: " + slider_value);
                    console.log("SliderBank: " + sliderBank);
                    console.log("Time: " + timeBank);

                    roundUserAnswer.push(self.getQuestionAnswer(self.questions[questionCounter]));
                    roundAnswer.push(testBank[questionID]);
                }

                // TAKE A BREAK: Every n question, show the bank and take a break
                if (questionID % 10 == 0 && questionID != 0 && nextClick != 0) {
                    outputAnswer = outputAnswer.concat(roundUserAnswer);
                    console.log("BREAK QUESTION!");
                    console.log("slider value: " + slider_value);
                    console.log("User answer in round:" + roundUserAnswer);
                    console.log("testBank round answer:" + roundAnswer);

                    // COMPUTE BRIER SCORE AND GET CHART
                    roundScore = self.getBrier(roundUserAnswer, slider_value, roundAnswer)

                    moneyBank = moneyBank.concat(roundScore);
                    moneyBank = moneyBank.filter(Boolean); // Remove falsy because of pop()

                    console.log("Money earned in round:" + roundScore);
                    console.log("Money bank:" + moneyBank);

                    // Hide the question and sliders
                    self.hideAllQuestions();
                    $("#slider").css('display','none');
                    d3.selectAll("svg").attr("display", "none");
                    document.getElementById("slider-label").style.display = "none";

                    // Plot the current moneyBank if they are in the right group
                    self.getBank(moneyBank);
                    if (group == "Group 2: Linear Slider, Feedback" || group == "Group 4: Parabolic Slider, Feedback") {
                        $("#chart").css('display','block');;
                    } else {
                        $("#chart").css('display','none');;
                    }
                    //add the balance
                    currentBalance +=  Number(self.sumArr(roundScore).toFixed(2));

                    // Tell them to take a break
                    document.getElementById('message').innerHTML="Please take a 1 minute break! " +
                        "The \"Continue\" button will show after 1 minute at the bottom of the screen.<br><br>In the last " +
                        "round, your balance changed by: " + self.sumArr(roundScore).toFixed(2) + "$" +
                        "<br><br>Your current total balance is $" + currentBalance.toFixed(2);
                    $('#nextBtn').hide()
                    $('#nextBtn').delay(60000).show(0); // Show button after n/1000 seconds. (e.g., n=60000 is 60 sec)

                    // Reset the iterator
                    nextClick = 0;

                    // Reset slider values
                    slider_value = [];
                    roundAnswer = [];
                    roundUserAnswer = [];

                    // Reset the bank for new round
                    moneyBank = ['Earnings from Previous Round'];
                }
                // Move on to next question if not break
                else {
                    // Move the slider back to 0
                    $("#slider").slider("value",  $("#slider").slider("option", "min"));
                    $("#custom-handle").text( 50 );
                    // Increase the question index and click counter
                    nextClick += 1;
                    questionCounter += 1;

                    document.getElementById('message').innerHTML="";
                    self.showNextQuestionSet();
                    $("#chart").hide();
                }
            }

            // FINAL QUESTION
            else {

                var endTime = new Date();
                var elapsed = endTime - startTime;
                startTime = new Date();

                // Store the slider value and elapsed time
                if (group == "Group 4: Parabolic Slider, Feedback" ||group == "Group 3: Parabolic Slider, No Feedback") {
                    if (coords[0] <= 50) {
                        slider_value.push(0.5);
                        sliderBank.push(0.5);
                    }
                    else {
                        if (coords[0] > 180) {
                            slider_value.push(1);
                            sliderBank.push(1);
                        }
                        else {
                            slider_value.push(((coords[0]-50)/260+0.5));
                            sliderBank.push(((coords[0]-50)/260+0.5));
                        }
                    }
                    coords[0]=50;

                    timeBank.push(elapsed)
                }
                else {
                    slider_value.push($('#slider').slider('value')/100);
                    sliderBank.push($('#slider').slider('value')/100);
                    timeBank.push(elapsed)
                }
                roundUserAnswer.push(self.getQuestionAnswer(self.questions[questionCounter]));
                roundAnswer.push(testBank[questionID]);
                outputAnswer = outputAnswer.concat(roundUserAnswer);

                console.log(slider_value);
                console.log(sliderBank);
                console.log(outputAnswer);

                roundScore = self.getBrier(roundUserAnswer, slider_value, roundAnswer)

                moneyBank = moneyBank.concat(roundScore);
                moneyBank = moneyBank.filter(Boolean); // Remove falsy because of pop()

                console.log(roundScore)
                currentBalance +=  Number(self.sumArr(roundScore).toFixed(2));

                // Hide the question and sliders
                self.hideAllQuestions();
                $("#slider").css('display','none');
                d3.selectAll("svg").attr("display", "none");
                document.getElementById("slider-label").style.display = "none"
                document.getElementById('message').innerHTML="Thank you for your participation in this study! Your answers have been saved." +
                    "<br><br>In the last round, your balance changed by: $" +
                    self.sumArr(roundScore).toFixed(2) + "<br><br>The total money you've earned is $" +
                    currentBalance.toFixed(2);

                // Plot the current moneyBank
                self.getBank(moneyBank);
                if (group == "Group 2: Linear Slider, Feedback" || group == "Group 4: Parabolic Slider, Feedback") {
                    $("#chart").css('display','block');;
                } else {
                    $("#chart").css('display','none');;
                }

                nextClick += 1;
                // Get all of the answers and money earned to save
                var answers = {moneyEarned: currentBalance.toFixed(2)};
                for (i = 0; i < self.questions.length; i++) {
                    answers[self.questions[i].id] = [testBank[i-6], outputAnswer[i], sliderBank[i], timeBank[i]];
                }

                // Write answer to file (Note: Only works for Chrome | Not Safari)
                self.saveAnswers(JSON.stringify(answers), String(subjectID) + '.json');
                self.hideAllQuestions();
                $("#chart").css('display','block');
                $("#slider").css('display','none');
                d3.selectAll("svg").attr("display", "none");
                $('#nextBtn').hide();
                document.getElementById("slider-label").style.display = "none";


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

    // Function to get the answers to the radio button questions
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
            $("#slider").css('display','none');
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
    //
    //
    survey.hideAllQuestions = function() {
        $('.question:visible').each(function(index, element){
            $(element).hide();
        });
        $('.required-message').each(function(index, element){
            $(element).hide();
        });
    }

    // Function to get the next question
    //
    //
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


    // Create the buttons for the survey
    //
    //
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




    // Use to get the answers and save to file locally
    //
    //
    survey.saveAnswers = function (text, filename){
        var a = document.createElement('a');
        a.setAttribute('href', 'data:text/plain;charset=utf-u,' + encodeURIComponent(text));
        a.setAttribute('download', filename);
        a.click()
    }

    //calculate brier score
    //
    //
    survey.getBrier = function(userAnswer, sliderValue, testBank) {
        var gain_loss = [];

        for (var i = 0; i < userAnswer.length; i++) {
            if (userAnswer[i] == testBank[i]) { // Correct
                if (sliderValue[i] == 0.5){
                    gain_loss.push(0.000000001);
                } else {
                    gain_loss.push(sliderValue[i] * 0.25);
                }
            } else {
                if (sliderValue[i] == 0.5){
                    gain_loss.push(0.000000001);
                } else {
                    gain_loss.push(0.25 * (-3 * Math.pow(sliderValue[i], 2)));
                }
            }
        }
        return gain_loss
    }

    //display the bank after the break
    //
    //
    survey.getBank = function (moneyBank) {
        var chart = c3.generate({
            size: {
                height: 240,
                width: 480
            },
            data: {
                columns: [
                    moneyBank,
                    ['Reference Line',0,0,0,0,0,0,0,0,0,0] // # of 0 should be the number of questions per round
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
                    max: 0.25,
                    min: -0.75,
                    label: "Bank Changes ($)"
                    // Range includes padding, set 0 if no padding needed
                    // padding: {top:0, bottom:0}
                },
                x: {
                    label: "Question",
                    show: false
                }
            },
            bar: {
                width: {
                    ratio: 0.3 // this makes bar width 50% of length between ticks
                }
            }
        });
    }
    //sum the balance
    //
    //
    survey.sumArr = function(array) {
        var count=0;
        for (var i=array.length; i--;) {
            count+=array[i];
        }
        return count;
    }

})(survey, jQuery); // End class

//////////////////////////////////////////////////////////////////////////////////////////
// LOAD IN THE QUESTIONS (TODO: Read CSV into JSON makes life easier)
//////////////////////////////////////////////////////////////////////////////////////////
$(document).ready(function(){
    $.getJSON('questions_subjective_UPDATED.json', function(json) {
        survey.setup_survey(json);
    });
});


window.onbeforeunload = function() {
    return "This will reset all answers that you've already filled in!";
}

// Function to read the answer csv into an array
//
//
function getTestBank(filename) {
    $.ajax({
        url: "answer/" + filename + ".csv",
        async: false,
        success: function (csvd) {
            data = $.csv.toArrays(csvd);
        },
        dataType: "text",
        complete: function () {
        }
    });
    return data[0];
};



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
        },
        start: function( event, ui ) {
            $('.ui-slider-handle').show();
        }
    });
} );

////////////////////////////////////////////////////////////////////////////////////
// Parabolic slider
////////////////////////////////////////////////////////////////////////////////////


function resetHandle() {
    d3.select("#handle_circle").remove()
    handle1 = [{x: 0, y: 0}];
    hor.attr("width", 0);
    ver.attr("height", 0);


    var drag = d3.behavior.drag()
        .origin(function(d) { return d; })
        .on("drag", dragged)
    function dragged(d) {

        coords = d3.mouse(this);
        var cx = Math.min(Math.max(coords[0], 0), 140);
        var cy = Math.min(Math.max(0.023  * cx * cx, 0), 440);
        d3.select('g.dot circle')
            .attr("cx", Math.min(cx, 130))
            .attr("cy", Math.min(cy, 390));


        hor.attr("width",Math.min(cx,width));
        ver.attr("height", Math.min(cy,height));

        var div = d3.select("body").select("#final")
        //div.text("final value x: " + (Math.min(Math.max(cx*0.77, 0), 100)) + ",y: " + (Math.min(Math.max(cy*0.778,0), 300)))
            .style("left", (d3.event.pageX - 100) + "px")
            .style("top", (d3.event.pageY - 12) + "px");
    }

    handle_circle= container.append("g")
        .attr("id", "handle_circle")
        .attr("class", "dot")
        .attr("style", "display:none")
        .selectAll('circle')
        .data(handle1)
        .enter().append("circle")
        .attr("r", 3)
        .attr("cx", function(d) { return d.x;})
        .attr("cy", function(d) { return d.y;})
        .call(drag);
        clicked=false;
}

function parabolicSlider() {

    // populate data
    //
    //
    var data = [];
    getData();
    function getData() {
        for (var i = 0; i < 50; i++) {
            q = i
            p = gaussian(q)
            el = {
                "q": q,
                "p": p
            }
            var div = d3.select("#parabolic").select("#originData")
            div
                .text("x: " + q + ",y: " + p)
            // .style("left", (d3.event.pageX - 34) + "px")
            // .style("top", (d3.event.pageY - 12) + "px");
            //console.log("x: "+q+"y: "+p);

            data.push(el)
        };
        // need to sort for plotting
        data.sort(function (x, y) {
            return x.q - y.q;
        });
    }
    function gaussian(x) {
        return (-1) * x * x; // Function for line/curve
    };


    // create canvass
    //
    //
    var margin = {
            top: 20,
            right: 20,
            bottom: 30,
            left: 50
        },
        width = 200 - margin.left - margin.right,
        height =440 - margin.top - margin.bottom;

    var svg = d3.select("#parabolic").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    container = svg.append("g");
    console.log("container");
    console.log(container);


    // axises
    //
    //
    var x = d3.scale.linear()
    // .domain([0,d3.max(data)])
        .range([0, width]);//can adjust axis range

    var y = d3.scale.linear()
    // .domain([0,d3.max(data)])
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("top")
        .tickValues([])

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .tickValues([])

    x.domain(d3.extent(data, function (d) {
        return d.q;
    }));
    y.domain(d3.extent(data, function (d) {
        return d.p;
    }));

    svg.append("g")
        .attr("class", "x axis")
        // .attr("transform","translate(10,160)")
        .call(xAxis);
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    //label of axis
    //
    //
    var padding=2;
    svg.append("text")
        .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
        .attr("x", "-180")
        .attr("y", "-10")
        .attr("transform", "translate("+ (padding/2) +","+(height/2)+")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
        .style("font-size", "10px")
        .text("3 points");
    svg.append("text")
        .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
        .attr("x","0")
        .attr("y","-10")
        .attr("transform", "translate("+ (padding/2) +","+(height/2)+")rotate(-90)")
        .style("font-size", "10px")
        .text("Loss if incorrect");
    svg.append("text")
        .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
        .attr("x", "50")
        .attr("y", "-10")
        .attr("transform", "translate("+ (width/2) +","+(0)+")")  // centre below axis
        .style("font-size", "10px")
        .text("1 point");
    svg.append("text")
        .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
        .attr("x", "0")
        .attr("y", "-10")
        .attr("transform", "translate("+ (width/2) +","+(0)+")")  // centre below axis
        .style("font-size", "10px")

        .text("Gain if correct");


    // function plot
    //
    //
    var line = d3.svg.line()
        .x(function (d) {
            return x(d.q);
        })
        .y(function (d) {
            return y(d.p);
        });
    container.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("id", "lineId")
        .attr("d", line);

    handle1 = [{
        x: 0,
        y: 0
    }];

    // handle
    //
    //

    var drag = d3.behavior.drag()
        .origin(function(d) { return d; })
        .on("drag", dragged)
    function dragged(d) {

        var coordinates = d3.mouse(this);
        var cx = Math.min(Math.max(coordinates[0], 0), 140);
        var cy = Math.min(Math.max(0.023  * cx * cx, 0), 440);
        d3.select('g.dot circle')
            .attr("cx", Math.min(cx, 130))
            .attr("cy", Math.min(cy, 390));
        svg.select("rect[id='horizontal']")
            .attr("width", Math.min(cx,width));
        svg.select("rect[id='vertical']")
            .attr("height",Math.min(cy,height));

        clicked = false;
    }
    handle_circle= container.append("g")
        .attr("id","handle_circle")
        .attr("class", "dot")
        .attr("style", "display:none")
        .selectAll('circle')
        .data(handle1)
        .enter().append("circle")
        .attr("r", 3)
        .attr("cx", function(d) { return d.x;})
        .attr("cy", function(d) { return d.y;})
        .call(drag);

    //color bar
    //
    //
    hor=container.append("rect")
        .attr("id","hor")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", 0)
        .attr("height", 10)
        .attr("fill", "green")
        .attr("id", "horizontal")
        .attr("opacity",0.3);

    ver=container.append("rect")
        .attr("id","ver")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", 10)
        .attr("height", 0)
        .attr("fill", "red")
        .attr("id", "vertical")
        .attr("opacity",0.3);

    container.append("use")
        .attr("id",'use')
        .attr("xlink:href",'#lineId');


    //mouse move
    //
    //
    function findTheMouse() {
        var coordinates = d3.mouse(this);
    }
    d3.select("svg")
        .on("mousemove", findTheMouse);

    //mouse click
    //
    //

    // d3.select("svg")
    //     .on("click", function() {
    //         console.log("I am here")
    //         coords = d3.mouse(this);
    //         var div = d3.select("body").select("#final")
    //         // div.text("final x: "+((coords[0]-50)/260+0.5) + ", final y: " + -3*((coords[0]-50)/260+0.5)*((coords[0]-50)/260+0.5));
    //         // div.text("final x: "+((coords[0]-50)/260+0.5) + ", final y: " + -3*((coords[0]-50)/260+0.5)*((coords[0]-50)/260+0.5));
    //     });

    function click_on_canvas() {
        coords = d3.mouse(this);
        var cx = Math.min(Math.max(coords[0] - 50, 0), 140);
        var cy = Math.min(Math.max(0.023  * cx * cx, 0), 440);
        container.select("g.dot").attr("style", "display:block")

        if(!clicked){
                d3.select('g.dot circle')
                    .attr("cx", Math.min(cx, 130))
                    .attr("cy", Math.min(cy, 390));
                svg.select("rect[id='horizontal']")
                    .attr("width", Math.min(cx, width));
                svg.select("rect[id='vertical']")
                    .attr("height", Math.min(cy, height));
                clicked=true;
            }
    }
    d3.select("svg")
        .on("click", click_on_canvas)


    parabolicSlider = function(){}; // Only allows function to be called once

}