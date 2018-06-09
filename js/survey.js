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
var coords = [50, 0];
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

    survey.setup_survey = function (questions) {
        /*
            questions: a json object, an array of dictionaries
         */
        var self = this;

        // Initialize needed computations
        var slider_value = []; // Use between rounds
        var sliderBank = [0, 0, 0, 0, 0, 0, 0]; // Use to output
        var questionCounter = 0; // Keeps track of what question we are currently
        var nextClick = 0; // Count number of time the button next is clicked; used to determine the breaks
        var answerBank = [];// Store responses for each question; used to get userID and group
        var outputAnswer = [0, 0, 0, 0, 0]; // Use to get the output file with the user answers
        var roundUserAnswer = [];//stores users' answers
        var roundAnswer = [];//stores standard answers
        var startTime = new Date();

        // Read in the appropriate test bank -> these are answers to the question
        var testBank = getTestBank("answer_subjective_UPDATED");

        this.questions = questions.slice(0, 11);

        this.questions.forEach(function (question) {//create DOM structure for each question
            self.generateQuestionElement(question);
        });

        var _tutorial_starts_flag = false;

        var _next_button = $('#nextBtn');

        _next_button.click(function () {
            var subjectID = self.getQuestionAnswer(self.questions[0]);
            var questionID = self.questions[questionCounter]['id'];
            var group = self.getQuestionAnswer(self.questions[1]);
            var ok = true;

            answerBank.push(self.getQuestionAnswer(self.questions[questionCounter]));//stores standard answer of the current question

            // Make question required and display message
            for (i = self.firstQuestionDisplayed; i <= self.lastQuestionDisplayed; i++) {
                if (self.questions[i]['required'] === true && !self.getQuestionAnswer(questions[i])) {
                    $('.question-container > div.question:nth-child(' + (i + 1) + ') > .required-message').show();
                    ok = false;

                    if (questionID === 0) {
                        location.reload();
                    }
                }
            }


            // Do nothing if no answer is selected
            if (!ok)
                return;

            var _slider = $("#slider");

            if (questionID === 0 && questionCounter === 1) {
                // Instruction given will depend on the group
                if (group === "Group 1: Linear Slider") {
                    document.getElementById('instructions').innerHTML = group1_linear_instruction;
                } else if (group === "Group 2: Parabolic Slider") {
                    document.getElementById('instructions').innerHTML = group2_parabolic_instruction;
                }
            }

            /* tutorial_welcome starts here! */
            else if (questionCounter > 1) {
                group = answerBank[1];

                if (group === "Group 1: Linear Slider") {
                    _slider.css('display', 'block'); // Show the regular slider
                    $('.ui-slider-handle').hide(); // Hide handle
                    d3.select("svg").remove(); // Destroy the parabolic slider

                    // Get rid of the instructions
                    document.getElementById("slider-label").style.display = "inline";
                    document.getElementById('instructions').innerHTML = "";

                    switch (questionCounter) {
                        case 2:
                            outputAnswer.push(subjectID);
                            outputAnswer.push(group);
                            document.getElementById("slider-label").style.display = "inline";
                            document.getElementById('slider-label').innerHTML = linear_slider_prompts;
                            document.getElementById('slider-instructions').innerHTML = linear_first_instruction_answer;
                            break;

                        case 3:
                            document.getElementById("slider-label").style.display = "inline";
                            document.getElementById('slider-label').innerHTML = linear_slider_prompts;
                            document.getElementById('slider-instructions').innerHTML = linear_second_instruction_answer;
                            break;

                        case 4:
                            document.getElementById("slider-label").style.display = "inline";
                            document.getElementById('slider-label').innerHTML = linear_slider_prompts;
                            document.getElementById('slider-instructions').innerHTML = linear_third_instruction_answer;
                            break;

                        case 5:
                            _slider.css('display', 'none');
                            document.getElementById('slider-instructions').innerHTML = "";
                            document.getElementById('slider-label').innerHTML = "";
                            document.getElementById('instructions').innerHTML = instruction_is_finished;
                            answerBank.splice(2); // Delete everything except the first two
                            break;

                        default:
                            document.getElementById('slider-instructions').innerHTML = "";
                            document.getElementById('slider-label').innerHTML = "What is the probability that " +
                                "you think your answer is correct?<br><br>";
                            break;
                    }
                }
                else if (group === "Group 2: Parabolic Slider") {
                    _slider.remove(); // Destroy the regular slider
                    parabolicSlider(); // Start the parabolic slider
                    d3.selectAll("svg").attr("display", "block"); // Make sure it is visible after the breaks

                    // Get rid of the instructions
                    document.getElementById("slider-label").style.display = "inline";
                    document.getElementById('slider-label').innerHTML = "";
                    document.getElementById('instructions').innerHTML = "";

                    if (_tutorial_starts_flag === false) {
                        alert('!!!')
                        document.getElementById('instructions').innerHTML = tutorial_starts;
                        document.getElementById("slider-label").style.display = "inline";
                        document.getElementById('slider-label').innerHTML = "";
                        _tutorial_starts_flag = true;
                    }
                    else {
                        switch (questionCounter) {
                            case 2:
                                console.log('here!');
                                outputAnswer.push(subjectID);
                                outputAnswer.push(group);
                                document.getElementById('slider-instructions').innerHTML = parabolic_first_question_answer;
                                document.getElementById("slider-label").style.display = "inline";
                                document.getElementById('slider-label').innerHTML = parablic_slider_prompts;
                                resetHandle();
                                break;

                            case 3:
                                document.getElementById('slider-instructions').innerHTML = parabolic_second_question_answer;
                                document.getElementById("slider-label").style.display = "inline";
                                document.getElementById('slider-label').innerHTML = parablic_slider_prompts;
                                resetHandle();
                                break;

                            case 4:
                                document.getElementById('slider-instructions').innerHTML = parabolic_third_question_answer;
                                document.getElementById("slider-label").style.display = "inline";
                                document.getElementById('slider-label').innerHTML = parablic_slider_prompts;
                                resetHandle();
                                break;

                            case 5:
                                document.getElementById('slider-instructions').innerHTML = "";
                                document.getElementById('slider-label').innerHTML = "";
                                document.getElementById('instructions').innerHTML = instruction_is_finished;
                                d3.selectAll("svg").attr("display", "none");
                                break;

                            default:
                                document.getElementById('slider-instructions').innerHTML = "";
                                document.getElementById('slider-label').innerHTML = "";
                                resetHandle();
                                break
                        }
                    }
                }
            }
            /* tutorial_welcome ends here! */

            // #####################
            // If button is clicked and answer is selected
            if (_next_button.text().indexOf('Continue') === 0) {

                var endTime = new Date();
                var elapsed = endTime - startTime;
                startTime = new Date();

                if (questionID > 0 && nextClick !== 0) {

                    slider_value.push(_slider.slider('value') / 100);
                    sliderBank.push(_slider.slider('value') / 100);

                    roundUserAnswer.push(self.getQuestionAnswer(self.questions[questionCounter]));
                    roundAnswer.push(testBank[questionID]);
                }

                // TAKE A BREAK: Every n question, show the bank and take a break
                if (questionID % 10 === 0 && questionID !== 0 && nextClick !== 0) {
                    outputAnswer = outputAnswer.concat(roundUserAnswer);
                    console.log("BREAK QUESTION!");
                    console.log("slider value: " + slider_value);
                    console.log("User answer in round:" + roundUserAnswer);
                    console.log("testBank round answer:" + roundAnswer);

                    // COMPUTE BRIER SCORE AND GET CHART
                    var roundScore = self.getBrier(roundUserAnswer, slider_value, roundAnswer);

                    // Hide the question and sliders
                    self.hideAllQuestions();
                    _slider.css('display', 'none');
                    d3.selectAll("svg").attr("display", "none");
                    document.getElementById("slider-label").style.display = "none";



                    // Tell them to take a break
                    document.getElementById('message').innerHTML = "Please take a 1 minute break! " +
                        "The \"Continue\" button will show after 1 minute at the bottom of the screen.<br><br>"
                    $('#nextBtn').hide();
                    // $('#nextBtn').delay(60000).show(0); // Show button after n/1000 seconds. (e.g., n=60000 is 60 sec)
                    timer(60000, function () {
                        $('#nextBtn').show();
                    });


                    // Reset the iterator
                    nextClick = 0;

                    // Reset slider values
                    slider_value = [];
                    roundAnswer = [];
                    roundUserAnswer = [];

                    // Reset the bank for new round
                }
                // Move on to next question if not break
                else {
                    // Move the slider back to 0
                    _slider.slider("value", _slider.slider("option", "min"));
                    $("#custom-handle").text(50);
                    // Increase the question index and click counter
                    nextClick += 1;
                    questionCounter += 1;

                    document.getElementById('message').innerHTML = "";
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
                slider_value.push(_slider.slider('value') / 100);
                sliderBank.push(_slider.slider('value') / 100);

                roundUserAnswer.push(self.getQuestionAnswer(self.questions[questionCounter]));
                roundAnswer.push(testBank[questionID]);
                outputAnswer = outputAnswer.concat(roundUserAnswer);

                console.log(slider_value);
                console.log(sliderBank);
                console.log(outputAnswer);

                roundScore = self.getBrier(roundUserAnswer, slider_value, roundAnswer);


                console.log(roundScore);

                // Hide the question and sliders
                self.hideAllQuestions();
                _slider.css('display', 'none');
                d3.selectAll("svg").attr("display", "none");
                document.getElementById("slider-label").style.display = "none";
                document.getElementById('message').innerHTML = "Thank you for your participation in this study! Your answers have been saved.";

                // Plot the current moneyBank
                var _chart = $("#chart");
                _chart.css('display', 'none');

                nextClick += 1;
                // Get all of the answers and money earned to save
                var answers = {};
                for (var i = 0; i < self.questions.length; i++) {
                    answers[self.questions[i].id] = [testBank[i - 6], outputAnswer[i], sliderBank[i]];
                }

                // Write answer to file (Note: Only works for Chrome | Not Safari)
                self.saveAnswers(JSON.stringify(answers), String(subjectID) + '.json');
                self.hideAllQuestions();
                _chart.css('display', 'block');
                $("#slider").css('display', 'none');
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
    };

    // Function to get the answers to the radio button questions
    survey.getQuestionAnswer = function (question) {
        var result;

        if (question.type === 'single-select' || question.type === 'single-select-oneline') {
            result = $('input[type="radio"][name="' + question.id + '"]:checked').val();
        }
        else if (question.type === 'text-field-small') {
            result = $('input[name=' + question.id + ']').val();
        }
        return result ? result : undefined;
    };

    // Function to the question
    survey.generateQuestionElement = function (question) {
        var questionElement = $('<div id="' + question.id + '" class="question"></div>');
        var questionTextElement = $('<div class="question-text"></div>');
        var questionAnswerElement = $('<div class="answer"></div>');
        // var questionCommentElement = $('<div class="comment"></div>');
        questionElement.appendTo($('.question-container'));
        questionElement.append(questionTextElement);
        questionElement.append(questionAnswerElement);
        // questionElement.append(questionCommentElement);
        questionTextElement.html(question.text);
        // questionCommentElement.html(question.comment);

        if (question.type === 'single-select') {
            questionElement.addClass('single-select');
            question.options.forEach(function (option) {
                questionAnswerElement.append('<label class="radio"><input type="radio" value="' + option + '" name="' + question.id + '"/>' + option + '</label>');
            });
        }
        else if (question.type === 'text-field-small') {
            // No slider for these types of questions
            $("#slider").css('display', 'none');
            document.getElementById("slider-label").style.display = 'none';
            questionElement.addClass('text-field-small');
            questionAnswerElement.append('<input type="text" value="" class="text" name="' + question.id + '">');
        }
        else if (question.type === 'single-select-oneline') {
            questionElement.addClass('single-select-oneline');
            var html = '<table border="0" cellpadding="5" cellspacing="0"><tr><td></td>';
            question.options.forEach(function (label) {
                html += '<td><label>' + label + '</label></td>';
            });
            html += '<td></td></tr><tr><td><div>' + question.labels[0] + '</div></td>';
            question.options.forEach(function (label) {
                html += '<td><div><input type="radio" value="' + label + '" name="' + question.id + '"></div></td>';
            });
            html += '<td><div>' + question.labels[1] + '</div></td></tr></table>';
            questionAnswerElement.append(html);
        }
        // If the question is marked as required, do not allow the user to continue
        if (question.required === true) {
            var last = questionTextElement.find(':last');
            (last.length ? last : questionTextElement).append('<span class="required-asterisk" aria-hidden="true">*</span>');
        }
        questionAnswerElement.after('<div class="required-message">Please select an answer before continuing.</div>');
        questionElement.hide();
    };

    // Function to hide question when we've reached the last page
    //
    //
    survey.hideAllQuestions = function () {
        $('.question:visible').each(function (index, element) {
            $(element).hide();
        });
        $('.required-message').each(function (index, element) {
            $(element).hide();
        });
    };

    // Function to get the next question
    //
    //
    survey.showNextQuestionSet = function () {
        this.hideAllQuestions();
        this.firstQuestionDisplayed = this.lastQuestionDisplayed + 1;

        do {
            this.lastQuestionDisplayed++;
            $('.question-container > div.question:nth-child(' + (this.lastQuestionDisplayed + 1) + ')').show();
            if (this.questions[this.lastQuestionDisplayed]['break_after'] === true)
                break;
        } while (this.lastQuestionDisplayed < this.questions.length - 1);

        this.doButtonStates();
    };


    // Create the buttons for the survey
    //
    //
    survey.doButtonStates = function () {
        var _next_button = $('#nextBtn');
        if (this.lastQuestionDisplayed === this.questions.length - 1) {
            _next_button.text('Finish');
            _next_button.addClass('blue');
        }
        else if (_next_button.text() === 'Finish') {
            _next_button.text('Continue »');
            _next_button.removeClass('blue');
        }
    };


    // Use to get the answers and save to file locally
    //
    //
    survey.saveAnswers = function (text, filename) {
        var a = document.createElement('a');
        a.setAttribute('href', 'data:text/plain;charset=utf-u,' + encodeURIComponent(text));
        a.setAttribute('download', filename);
        a.click()
    };

    //calculate brier score
    //
    //
    survey.getBrier = function (userAnswer, sliderValue, testBank) {
        var gain_loss = [];

        for (var i = 0; i < userAnswer.length; i++) {
            if (userAnswer[i] === testBank[i]) { // Correct
                if (sliderValue[i] === 0.5) {
                    gain_loss.push(0.000000001);
                } else {
                    gain_loss.push(sliderValue[i] * 0.25);
                }
            } else {
                if (sliderValue[i] === 0.5) {
                    gain_loss.push(0.000000001);
                } else {
                    gain_loss.push(0.25 * (-3 * Math.pow(sliderValue[i], 2)));
                }
            }
        }
        return gain_loss
    };
    //sum the balance
    //
    //
    survey.sumArr = function (array) {
        var count = 0;
        for (var i = array.length; i--;) {
            count += array[i];
        }
        return count;
    };

})(survey, jQuery); // End class

//////////////////////////////////////////////////////////////////////////////////////////
// LOAD IN THE QUESTIONS (TODO: Read CSV into JSON makes life easier)
//////////////////////////////////////////////////////////////////////////////////////////
$(document).ready(function () {
    $.getJSON('questions_subjective_UPDATED.json', function (json) {
        survey.setup_survey(json);
    });
});

window.onbeforeunload = function () {
    return "This will reset all answers that you've already filled in!";
};

////////////////////////////////////////////////////////////////////////////////////
// REGULAR SLIDER
////////////////////////////////////////////////////////////////////////////////////
$(function () {  // Document ready
    var handle = $("#custom-handle");

    $("#slider").slider({
        range: "min",
        value: 50,
        min: 50,
        max: 100,
        step: 1,
        animate: true,
        create: function () {
            handle.text($(this).slider("value"));
        },
        slide: function (event, ui) {
            handle.text(ui.value);
        },
        start: function (event, ui) {
            $('.ui-slider-handle').show();
        }
    });
});

////////////////////////////////////////////////////////////////////////////////////
// Parabolic slider
////////////////////////////////////////////////////////////////////////////////////


function resetHandle() {
    d3.select("#handle_circle").remove();
    handle1 = [{x: 0, y: 0}];
    hor.attr("width", 0);
    ver.attr("height", 0);


    var drag = d3.behavior.drag()
        .origin(function (d) {
            return d;
        })
        .on("drag", dragged);

    function dragged(d) {

        coords = d3.mouse(this);
        var cx = Math.min(Math.max(coords[0], 0), 140);
        var cy = Math.min(Math.max(0.023 * cx * cx, 0), 440);
        d3.select('g.dot circle')
            .attr("cx", Math.min(cx, 130))
            .attr("cy", Math.min(cy, 390));


        hor.attr("width", Math.min(cx, width));
        ver.attr("height", Math.min(cy, height));

        var div = d3.select("body").select("#final")
        //div.text("final value x: " + (Math.min(Math.max(cx*0.77, 0), 100)) + ",y: " + (Math.min(Math.max(cy*0.778,0), 300)))
            .style("left", (d3.event.pageX - 100) + "px")
            .style("top", (d3.event.pageY - 12) + "px");
    }

    handle_circle = container.append("g")
        .attr("id", "handle_circle")
        .attr("class", "dot")
        .attr("style", "display:none")
        .selectAll('circle')
        .data(handle1)
        .enter().append("circle")
        .attr("r", 3)
        .attr("cx", function (d) {
            return d.x;
        })
        .attr("cy", function (d) {
            return d.y;
        })
        .call(drag);
    clicked = false;
}

function parabolicSlider() {

    // populate data
    //
    //
    var data = [];
    getData();

    function getData() {
        for (var i = 0; i < 50; i++) {
            var q = i;
            var p = gaussian(q);
            var el = {
                "q": q,
                "p": p
            };
            var div = d3.select("#parabolic").select("#originData");
            div.text("x: " + q + ",y: " + p);
            data.push(el)
        }
        // need to sort for plotting
        data.sort(function (x, y) {
            return x.q - y.q;
        });
    }

    function gaussian(x) {
        return (-1) * x * x; // Function for line/curve
    }


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
        height = 440 - margin.top - margin.bottom;

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
        .tickValues([]);

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .tickValues([]);

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
    var padding = 2;
    svg.append("text")
        .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
        .attr("x", "-180")
        .attr("y", "-10")
        .attr("transform", "translate(" + (padding / 2) + "," + (height / 2) + ")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
        .style("font-size", "10px")
        .text("3 points");
    svg.append("text")
        .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
        .attr("x", "0")
        .attr("y", "-10")
        .attr("transform", "translate(" + (padding / 2) + "," + (height / 2) + ")rotate(-90)")
        .style("font-size", "10px")
        .text("Loss if incorrect");
    svg.append("text")
        .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
        .attr("x", "50")
        .attr("y", "-10")
        .attr("transform", "translate(" + (width / 2) + "," + (0) + ")")  // centre below axis
        .style("font-size", "10px")
        .text("1 point");
    svg.append("text")
        .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
        .attr("x", "0")
        .attr("y", "-10")
        .attr("transform", "translate(" + (width / 2) + "," + (0) + ")")  // centre below axis
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
        .origin(function (d) {
            return d;
        })
        .on("drag", dragged);

    function dragged(d) {

        var coordinates = d3.mouse(this);
        var cx = Math.min(Math.max(coordinates[0], 0), 140);
        var cy = Math.min(Math.max(0.023 * cx * cx, 0), 440);
        d3.select('g.dot circle')
            .attr("cx", Math.min(cx, 130))
            .attr("cy", Math.min(cy, 390));
        svg.select("rect[id='horizontal']")
            .attr("width", Math.min(cx, width));
        svg.select("rect[id='vertical']")
            .attr("height", Math.min(cy, height));

        clicked = false;
    }

    handle_circle = container.append("g")
        .attr("id", "handle_circle")
        .attr("class", "dot")
        .attr("style", "display:none")
        .selectAll('circle')
        .data(handle1)
        .enter().append("circle")
        .attr("r", 3)
        .attr("cx", function (d) {
            return d.x;
        })
        .attr("cy", function (d) {
            return d.y;
        })
        .call(drag);

    //color bar
    //
    //
    hor = container.append("rect")
        .attr("id", "hor")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", 0)
        .attr("height", 10)
        .attr("fill", "green")
        .attr("id", "horizontal")
        .attr("opacity", 0.3);

    ver = container.append("rect")
        .attr("id", "ver")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", 10)
        .attr("height", 0)
        .attr("fill", "red")
        .attr("id", "vertical")
        .attr("opacity", 0.3);

    container.append("use")
        .attr("id", 'use')
        .attr("xlink:href", '#lineId');


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


    function click_on_canvas() {
        coords = d3.mouse(this);
        var cx = Math.min(Math.max(coords[0] - 50, 0), 140);
        var cy = Math.min(Math.max(0.023 * cx * cx, 0), 440);
        container.select("g.dot").attr("style", "display:block");

        if (!clicked) {
            d3.select('g.dot circle')
                .attr("cx", Math.min(cx, 130))
                .attr("cy", Math.min(cy, 390));
            svg.select("rect[id='horizontal']")
                .attr("width", Math.min(cx, width));
            svg.select("rect[id='vertical']")
                .attr("height", Math.min(cy, height));
            clicked = true;
        }
    }

    d3.select("svg")
        .on("click", click_on_canvas);

    parabolicSlider = function () {
    }; // Only allows function to be called once

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
}